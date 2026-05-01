// ═══════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════
const state = {
  subject: null,
  mode: 'normal',          // 'normal' | 'exam' | 'revision' | 'duel'
  questions: [],
  currentIndex: 0,
  score: 0,
  answered: false,
  answers: [],

  // Timers
  timer: null,
  timeLeft: 0,
  totalTime: 0,
  timePerQuestion: 30,
  totalTimeUsed: 0,

  // Exam mode
  examTimer: null,
  examTimeLeft: 0,
  examTimeTotal: 0,

  // Duel mode
  duel: {
    p1Name: 'Joueur 1',
    p2Name: 'Joueur 2',
    p1Score: 0,
    p2Score: 0,
    p1Answered: false,
    p2Answered: false,
    p1Choice: -1,
    p2Choice: -1,
  },

  // Shuffled choices for current question
  _correctIndex: 0,
  _choices: [],
  _correctText: '',

  // For restart
  _lastSettings: null,
};

// ═══════════════════════════════════════════
//  LOCALSTORAGE KEYS
// ═══════════════════════════════════════════
const LS = {
  history:     'qcm_history',
  leaderboard: 'qcm_leaderboard',
  wrong:       'qcm_wrong_answers',
  custom:      'qcm_custom',
};

const lsGet = key => JSON.parse(localStorage.getItem(key) || '[]');
const lsSet = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// ═══════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════
const $ = id => document.getElementById(id);
const LETTERS = ['A', 'B', 'C', 'D'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(s) {
  const m = Math.floor(s / 60), sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function formatClock(s) {
  const m = Math.floor(s / 60), sec = s % 60;
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

function formatDate(iso) {
  const d = new Date(iso);
  const locale = getLang() === 'fr' ? 'fr-FR' : 'en-US';
  return d.toLocaleDateString(locale, { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
}

// ═══════════════════════════════════════════
//  LANGUAGE
// ═══════════════════════════════════════════
function getSubjects() {
  return getLang() === 'en' ? SUBJECTS_EN : SUBJECTS;
}

function updateLangBtn() {
  const btn = $('lang-btn');
  if (btn) btn.textContent = getLang() === 'fr' ? 'EN' : 'FR';
}

function switchLang() {
  const prevCatVal = $('category-select').value;
  setLang(getLang() === 'fr' ? 'en' : 'fr');
  updateLangBtn();
  initHome();
  // Restore selected subject card and settings
  if (state.subject) {
    const card = document.querySelector(`.subject-card[data-key="${state.subject}"]`);
    if (card) {
      card.classList.add('selected');
      $('start-btn').disabled = false;
    }
    populateCategorySelect(state.subject);
    $('category-select').value = prevCatVal;
  }
}

// ═══════════════════════════════════════════
//  SCREENS
// ═══════════════════════════════════════════
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
  window.scrollTo(0, 0);
}

function goHome() {
  clearInterval(state.timer);
  clearInterval(state.examTimer);
  showScreen('home-screen');
}

function openHistory() {
  renderHistory();
  showScreen('history-screen');
}

function openLeaderboard() {
  renderLeaderboard();
  showScreen('leaderboard-screen');
}

function openCustom() {
  renderCustomList();
  showScreen('custom-screen');
}

// ═══════════════════════════════════════════
//  HOME — INIT
// ═══════════════════════════════════════════
function initHome() {
  const grid = $('subjects-grid');
  grid.innerHTML = '';

  // Real subjects
  Object.keys(getSubjects()).forEach(key => {
    const sub = getSubjects()[key];
    const totalQ = sub.categories.reduce((s, c) => s + c.questions.length, 0);
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.dataset.key = key;
    card.innerHTML = `
      <div class="subject-icon" style="background:${sub.color}22;box-shadow:0 0 0 1px ${sub.color}44">
        <i class="${sub.icon}" style="color:${sub.color}"></i>
      </div>
      <div class="subject-name">${sub.label}</div>
      <div class="subject-count">${sub.categories.length} ${t('subject.categories')} · ${totalQ} ${t('subject.questions')}</div>
    `;
    card.addEventListener('click', () => selectSubject(key, card));
    grid.appendChild(card);
  });

  // Custom questions subject card (if any saved)
  const custom = lsGet(LS.custom);
  if (custom.length > 0) {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.dataset.key = '__custom__';
    card.innerHTML = `
      <div class="subject-icon" style="background:#06b6d422;box-shadow:0 0 0 1px #06b6d444">
        <i class="fa-solid fa-star" style="color:#06b6d4"></i>
      </div>
      <div class="subject-name">${t('subject.myquestions')}</div>
      <div class="subject-count">${t('subject.mycategory')} · ${custom.length} ${t('subject.questions')}</div>
    `;
    card.addEventListener('click', () => selectSubject('__custom__', card));
    grid.appendChild(card);
  }

  // Coming soon placeholders
  [
    { nameKey: 'subject.physics',   icon: 'fa-solid fa-atom' },
    { nameKey: 'subject.history2',  icon: 'fa-solid fa-landmark' },
    { nameKey: 'subject.chemistry', icon: 'fa-solid fa-flask' },
  ].forEach(s => {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.style.cssText = 'opacity:.4;cursor:not-allowed';
    card.innerHTML = `
        <div class="badge-new">${t('subject.soon')}</div>
        <div class="subject-icon" style="background:#ffffff11"><i class="${s.icon}" style="color:#94a3b8"></i></div>
        <div class="subject-name">${t(s.nameKey)}</div>
        <div class="subject-count">${t('subject.comingsoon')}</div>
      `;
    grid.appendChild(card);
  });

  populateCategorySelect(null);
}

function selectSubject(key, card) {
  document.querySelectorAll('.subject-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  state.subject = key;
  populateCategorySelect(key);
  if (state.mode === 'revision') {
    $('start-btn').disabled = lsGet(LS.wrong).length === 0;
  } else {
    $('start-btn').disabled = false;
  }
}

function populateCategorySelect(key) {
  const sel = $('category-select');
  sel.innerHTML = `<option value="all">${t('settings.allcategories')}</option>`;
  if (!key) return;
  if (key === '__custom__') return;
  getSubjects()[key].categories.forEach((cat, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${cat.name} (${cat.questions.length} q.)`;
    sel.appendChild(opt);
  });
}

// ═══════════════════════════════════════════
//  MODE SELECTOR
// ═══════════════════════════════════════════
function setMode(mode, btn) {
  state.mode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Toggle UI elements based on mode
  const isExam     = mode === 'exam';
  const isRevision = mode === 'revision';
  const isDuel     = mode === 'duel';

  $('grp-time').classList.toggle('hidden', isExam);
  $('grp-exam-time').classList.toggle('hidden', !isExam);
  $('grp-category').classList.toggle('hidden', isRevision);
  $('grp-count').classList.toggle('hidden', isRevision);
  $('grp-player2').classList.toggle('hidden', !isDuel);
  $('grp-revision-info').classList.toggle('hidden', !isRevision);

  if (isRevision) {
    const wrong = lsGet(LS.wrong);
    const infoEl = $('revision-info-msg');
    infoEl.textContent = wrong.length > 0
      ? `${wrong.length} question(s) à réviser depuis votre dernière session`
      : "Aucune erreur à réviser — jouez d'abord une partie !";
    infoEl.className = 'revision-info ' + (wrong.length > 0 ? 'has-items' : 'empty');
    $('start-btn').disabled = wrong.length === 0;
  } else {
    $('start-btn').disabled = !state.subject;
  }
}

// ═══════════════════════════════════════════
//  START QUIZ
// ═══════════════════════════════════════════
function startQuiz() {
  if (!state.subject && state.mode !== 'revision') return;

  clearInterval(state.timer);
  clearInterval(state.examTimer);

  const countVal = parseInt($('count-select').value);
  state.timePerQuestion = parseInt($('time-select').value);

  // Build question pool
  let pool = [];

  if (state.mode === 'revision') {
    pool = lsGet(LS.wrong).map(q => ({ ...q }));
    if (pool.length === 0) return;

  } else if (state.subject === '__custom__') {
    const custom = lsGet(LS.custom);
    pool = custom.map(q => ({ ...q, _cat: q._cat || t('quiz.myquestions') }));

  } else {
    const sub = getSubjects()[state.subject];
    const catVal = $('category-select').value;
    if (catVal === 'all') {
      sub.categories.forEach(cat => cat.questions.forEach(q => pool.push({ ...q, _cat: cat.name })));
    } else {
      const cat = sub.categories[parseInt(catVal)];
      cat.questions.forEach(q => pool.push({ ...q, _cat: cat.name }));
    }
  }

  pool = shuffle(pool);
  state.questions = pool.slice(0, Math.min(countVal, pool.length));
  state.currentIndex = 0;
  state.score = 0;
  state.answers = [];
  state.totalTimeUsed = 0;

  // Duel init
  const p1 = $('player-name').value.trim() || t('player.default1');
  const p2 = $('player2-name').value.trim() || t('player.default2');
  state.duel = { p1Name: p1, p2Name: p2, p1Score: 0, p2Score: 0, p1Answered: false, p2Answered: false, p1Choice: -1, p2Choice: -1 };

  // Save settings for restart
  state._lastSettings = {
    subject: state.subject,
    mode: state.mode,
    categoryVal: $('category-select').value,
    countVal,
    timePerQuestion: state.timePerQuestion,
    examTimeSecs: parseInt($('exam-time-select').value),
    p1Name: p1,
    p2Name: p2,
  };

  showScreen('quiz-screen');

  // Exam mode: start total countdown
  if (state.mode === 'exam') {
    const total = parseInt($('exam-time-select').value);
    state.examTimeLeft = total;
    state.examTimeTotal = total;
    $('exam-banner').classList.remove('hidden');
    $('question-timer-row').classList.add('hidden');
    updateExamBanner();
    state.examTimer = setInterval(() => {
      state.examTimeLeft--;
      updateExamBanner();
      if (state.examTimeLeft <= 0) {
        clearInterval(state.examTimer);
        forceEndQuiz();
      }
    }, 1000);
  } else {
    $('exam-banner').classList.add('hidden');
    $('question-timer-row').classList.remove('hidden');
  }

  // Duel UI
  $('duel-live-scores').classList.toggle('hidden', state.mode !== 'duel');
  if (state.mode === 'duel') {
    $('dlp1-name').textContent = state.duel.p1Name;
    $('dlp2-name').textContent = state.duel.p2Name;
    $('dlp1-pts').textContent = '0 pt';
    $('dlp2-pts').textContent = '0 pt';
  }

  // Subject badge color
  if (state.subject && state.subject !== '__custom__') {
    const sub = getSubjects()[state.subject];
    $('quiz-subject-badge').textContent = sub.label;
    $('quiz-subject-badge').style.cssText = `background:${sub.color}22;color:${sub.color};border-color:${sub.color}55`;
  } else {
    $('quiz-subject-badge').textContent = state.mode === 'revision' ? t('quiz.revision') : t('quiz.myquestions');
    $('quiz-subject-badge').style.cssText = '';
  }

  renderQuestion();
}

function restartQuiz() {
  // Restore settings and relaunch
  if (!state._lastSettings) { goHome(); return; }
  const s = state._lastSettings;
  state.subject = s.subject;
  state.mode = s.mode;
  $('player-name').value = s.p1Name;
  $('player2-name').value = s.p2Name;
  $('count-select').value = s.countVal;
  $('time-select').value = s.timePerQuestion;
  $('exam-time-select').value = s.examTimeSecs;
  startQuiz();
}

// ═══════════════════════════════════════════
//  RENDER QUESTION
// ═══════════════════════════════════════════
function renderQuestion() {
  const q = state.questions[state.currentIndex];
  const total = state.questions.length;

  $('quiz-category').textContent = q._cat || '';
  $('quiz-score').innerHTML = `${t('quiz.score')} <span>${state.score}</span>`;
  $('progress-text').textContent = `${t('quiz.question')} ${state.currentIndex + 1} / ${total}`;
  $('progress-fill').style.width = `${(state.currentIndex / total) * 100}%`;
  $('question-number').textContent = `${t('quiz.question')} ${state.currentIndex + 1}`;
  $('question-text').textContent = q.question;

  // Shuffle choices
  const correct = q.correct;
  const correctText = q.choices[correct];
  const shuffled = shuffle(q.choices.map((text, i) => ({ text, isCorrect: i === correct })));
  state._correctIndex = shuffled.findIndex(c => c.isCorrect);
  state._choices = shuffled.map(c => c.text);
  state._correctText = correctText;

  // Explanation
  const exp = $('explanation');
  exp.className = 'explanation';
  exp.innerHTML = '';

  $('next-btn').style.display = 'none';
  state.answered = false;

  // Render choices grid based on mode
  if (state.mode === 'duel') {
    renderDuelChoices(shuffled);
  } else {
    renderNormalChoices(shuffled);
  }

  // Timer (not in exam mode)
  if (state.mode !== 'exam') {
    startTimer();
  }
}

function renderNormalChoices(shuffled) {
  const grid = $('choices-grid');
  grid.innerHTML = '';
  grid.className = 'choices-grid';

  shuffled.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `<span class="choice-letter">${LETTERS[i]}</span><span>${choice.text}</span>`;
    btn.addEventListener('click', () => handleAnswer(i));
    grid.appendChild(btn);
  });
}

function renderDuelChoices(shuffled) {
  const grid = $('choices-grid');
  grid.innerHTML = '';
  grid.className = '';

  // Reset duel state
  state.duel.p1Answered = false;
  state.duel.p2Answered = false;
  state.duel.p1Choice   = -1;
  state.duel.p2Choice   = -1;

  const wrapper = document.createElement('div');
  wrapper.className = 'duel-grid';

  // P1 column
  const col1 = document.createElement('div');
  col1.className = 'duel-col p1-col';
  col1.innerHTML = `<div class="duel-col-header p1">${state.duel.p1Name}</div>`;
  shuffled.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.id = `dp1-${i}`;
    btn.innerHTML = `<span class="choice-letter">${LETTERS[i]}</span><span>${choice.text}</span>`;
    btn.addEventListener('click', () => handleDuelAnswer(1, i));
    col1.appendChild(btn);
  });

  // P2 column
  const col2 = document.createElement('div');
  col2.className = 'duel-col p2-col';
  col2.innerHTML = `<div class="duel-col-header p2">${state.duel.p2Name}</div>`;
  shuffled.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.id = `dp2-${i}`;
    btn.innerHTML = `<span class="choice-letter">${LETTERS[i]}</span><span>${choice.text}</span>`;
    btn.addEventListener('click', () => handleDuelAnswer(2, i));
    col2.appendChild(btn);
  });

  wrapper.appendChild(col1);
  wrapper.appendChild(col2);
  grid.appendChild(wrapper);
}

// ═══════════════════════════════════════════
//  TIMERS
// ═══════════════════════════════════════════
function startTimer() {
  clearInterval(state.timer);
  state.timeLeft  = state.timePerQuestion;
  state.totalTime = state.timePerQuestion;
  updateTimerUI();

  // "sans limite" (9999)
  if (state.timePerQuestion >= 9999) {
    $('timer-fill').style.width = '100%';
    $('timer-text').textContent = '∞';
    return;
  }

  state.timer = setInterval(() => {
    state.timeLeft--;
    updateTimerUI();
    if (state.timeLeft <= 0) {
      clearInterval(state.timer);
      if (state.mode === 'duel') resolveDuel();
      else handleAnswer(-1);
    }
  }, 1000);
}

function updateTimerUI() {
  const pct  = (state.timeLeft / state.totalTime) * 100;
  const fill = $('timer-fill');
  fill.style.width = pct + '%';
  fill.className = 'timer-fill';
  if (pct <= 30) fill.classList.add('danger');
  else if (pct <= 60) fill.classList.add('warning');
  $('timer-text').textContent = state.timeLeft + 's';
}

function updateExamBanner() {
  const pct = (state.examTimeLeft / state.examTimeTotal) * 100;
  $('exam-time-left').textContent = formatClock(state.examTimeLeft);
  $('exam-bar-fill').style.width = pct + '%';
  if (state.examTimeLeft < 300) $('exam-bar-fill').style.background = 'var(--danger)';
}

// Force end (exam timer ran out)
function forceEndQuiz() {
  clearInterval(state.timer);
  // Record current question as unanswered if not yet answered
  if (!state.answered && state.currentIndex < state.questions.length) {
    const q = state.questions[state.currentIndex];
    state.answers.push({ question: q.question, correct: state._correctText, chosen: t('quiz.unanswered'), isCorrect: false });
  }
  // Fill remaining as unanswered
  for (let i = state.currentIndex + 1; i < state.questions.length; i++) {
    const q = state.questions[i];
    state.answers.push({ question: q.question, correct: q.choices[q.correct], chosen: t('quiz.unanswered'), isCorrect: false });
  }
  showResults();
}

// ═══════════════════════════════════════════
//  HANDLE ANSWER (normal / exam)
// ═══════════════════════════════════════════
function handleAnswer(chosenIndex) {
  if (state.answered) return;
  state.answered = true;
  clearInterval(state.timer);

  const timeUsed = state.mode === 'exam' ? 0 : (state.totalTime - state.timeLeft);
  state.totalTimeUsed += timeUsed;

  const q = state.questions[state.currentIndex];
  const correct = state._correctIndex;
  const isCorrect = chosenIndex === correct;
  if (isCorrect) state.score++;

  // Color buttons (not in exam mode — feedback only at end)
  const btns = $('choices-grid').querySelectorAll('.choice-btn');
  if (state.mode !== 'exam') {
    btns.forEach((btn, i) => {
      btn.disabled = true;
      if (i === correct) btn.classList.add('correct');
      else if (i === chosenIndex) btn.classList.add('wrong');
    });

    const exp = $('explanation');
    const label = isCorrect ? t('quiz.correct') : chosenIndex === -1 ? t('quiz.timeout') : t('quiz.wrong');
    exp.innerHTML = `<strong>${label}</strong> ${q.explanation || ''}`;
    exp.classList.add('visible');
  } else {
    // Exam: disable chosen button only
    btns.forEach(b => b.disabled = true);
  }

  state.answers.push({
    question: q.question,
    correct: state._correctText,
    chosen: chosenIndex >= 0 ? state._choices[chosenIndex] : t('quiz.noanswer'),
    isCorrect,
  });

  // Wrong answers pool — save for revision mode
  if (!isCorrect && state.mode !== 'revision') {
    const wrongs = lsGet(LS.wrong);
    const qData = { ...q, _cat: q._cat };
    // Avoid duplicates
    const exists = wrongs.some(w => w.question === q.question);
    if (!exists) wrongs.push(qData);
    lsSet(LS.wrong, wrongs);
  } else if (isCorrect && state.mode === 'revision') {
    // Remove from wrong pool once answered correctly
    const wrongs = lsGet(LS.wrong).filter(w => w.question !== q.question);
    lsSet(LS.wrong, wrongs);
  }

  $('quiz-score').innerHTML = `${t('quiz.score')} <span>${state.score}</span>`;
  $('next-btn').style.display = 'inline-flex';
  $('next-btn').textContent = state.currentIndex + 1 < state.questions.length ? t('btn.next') : t('btn.results');
}

// ═══════════════════════════════════════════
//  DUEL ANSWER
// ═══════════════════════════════════════════
function handleDuelAnswer(player, chosenIndex) {
  const alreadyAnswered = player === 1 ? state.duel.p1Answered : state.duel.p2Answered;
  if (alreadyAnswered) return;

  if (player === 1) {
    state.duel.p1Answered = true;
    state.duel.p1Choice   = chosenIndex;
    // Disable P1 buttons
    for (let i = 0; i < 4; i++) {
      const b = $(`dp1-${i}`);
      if (b) b.disabled = true;
    }
  } else {
    state.duel.p2Answered = true;
    state.duel.p2Choice   = chosenIndex;
    for (let i = 0; i < 4; i++) {
      const b = $(`dp2-${i}`);
      if (b) b.disabled = true;
    }
  }

  if (state.duel.p1Answered && state.duel.p2Answered) resolveDuel();
}

function resolveDuel() {
  clearInterval(state.timer);
  if (state.answered) return;
  state.answered = true;

  const correct = state._correctIndex;
  const p1ok = state.duel.p1Choice === correct;
  const p2ok = state.duel.p2Choice === correct;

  if (p1ok) state.duel.p1Score++;
  if (p2ok) state.duel.p2Score++;
  state.score = state.duel.p1Score; // main score = P1

  // Color all buttons
  for (let i = 0; i < 4; i++) {
    const b1 = $(`dp1-${i}`);
    const b2 = $(`dp2-${i}`);
    if (b1) {
      b1.disabled = true;
      if (i === correct) b1.classList.add('correct');
      else if (i === state.duel.p1Choice) b1.classList.add('wrong');
    }
    if (b2) {
      b2.disabled = true;
      if (i === correct) b2.classList.add('correct');
      else if (i === state.duel.p2Choice) b2.classList.add('wrong');
    }
  }

  // Live scores update
  $('dlp1-pts').textContent = `${state.duel.p1Score} pt`;
  $('dlp2-pts').textContent = `${state.duel.p2Score} pt`;

  const q = state.questions[state.currentIndex];
  const exp = $('explanation');
  const lines = [];
  if (state.duel.p1Choice === -1) lines.push(`${state.duel.p1Name} : ${t('duel.timeout')}`);
  else lines.push(`${state.duel.p1Name} : ${p1ok ? t('duel.correct') : t('duel.wrong')}`);
  if (state.duel.p2Choice === -1) lines.push(`${state.duel.p2Name} : ${t('duel.timeout')}`);
  else lines.push(`${state.duel.p2Name} : ${p2ok ? t('duel.correct') : t('duel.wrong')}`);
  exp.innerHTML = `<strong>${lines.join(' — ')}</strong> ${q.explanation || ''}`;
  exp.classList.add('visible');

  state.answers.push({
    question: q.question,
    correct: state._correctText,
    chosen: state.duel.p1Choice >= 0 ? state._choices[state.duel.p1Choice] : t('duel.noanswer'),
    isCorrect: p1ok,
    duel: { p1ok, p2ok },
  });

  $('next-btn').style.display = 'inline-flex';
  $('next-btn').textContent = state.currentIndex + 1 < state.questions.length ? t('btn.next') : t('btn.results');
}

// ═══════════════════════════════════════════
//  NEXT QUESTION
// ═══════════════════════════════════════════
function nextQuestion() {
  state.currentIndex++;
  if (state.currentIndex < state.questions.length) renderQuestion();
  else showResults();
}

// ═══════════════════════════════════════════
//  RESULTS
// ═══════════════════════════════════════════
function showResults() {
  clearInterval(state.timer);
  clearInterval(state.examTimer);
  showScreen('results-screen');

  const total = state.questions.length;
  const score = state.mode === 'duel' ? state.duel.p1Score : state.score;
  const pct   = total > 0 ? Math.round((score / total) * 100) : 0;

  // Icon & title
  let icon, title;
  if (pct >= 80) { icon = '🏆'; title = t('results.excellent'); }
  else if (pct >= 60) { icon = '👍'; title = t('results.good'); }
  else if (pct >= 40) { icon = '📚'; title = t('results.average'); }
  else { icon = '💪'; title = t('results.bad'); }

  $('results-icon').textContent = icon;
  $('results-title').textContent = title;

  const modLabel = {
    normal: t('results.mode.normal'), exam: t('results.mode.exam'),
    revision: t('results.mode.revision'), duel: t('results.mode.duel'),
  }[state.mode];
  const subLabel = state.subject && state.subject !== '__custom__' && getSubjects()[state.subject]
    ? getSubjects()[state.subject].label : t('subject.custom.label');
  $('results-subtitle').textContent = `${subLabel} · ${modLabel}`;

  // Score circle
  const circle = $('score-circle');
  circle.className = 'score-circle ' + (pct >= 70 ? 'excellent' : pct >= 45 ? 'good' : 'bad');
  $('score-pct').textContent = pct + '%';
  $('score-fraction').textContent = `${score} / ${total}`;

  $('stat-correct').textContent = score;
  $('stat-wrong').textContent = total - score;
  $('stat-time').textContent = formatTime(Math.round(state.totalTimeUsed));

  // Duel result block
  const duelBox = $('duel-result-box');
  if (state.mode === 'duel') {
    duelBox.classList.remove('hidden');
    const p1 = state.duel.p1Score, p2 = state.duel.p2Score;
    let winnerHtml = '';
    if (p1 > p2)       winnerHtml = `<div style="margin-top:12px;font-size:.95rem">🏆 <strong>${state.duel.p1Name}</strong></div>`;
    else if (p2 > p1)  winnerHtml = `<div style="margin-top:12px;font-size:.95rem">🏆 <strong>${state.duel.p2Name}</strong></div>`;
    else               winnerHtml = `<div style="margin-top:12px;font-size:.95rem">${t('duel.tie')}</div>`;
    duelBox.innerHTML = `
      <h3>${t('duel.result')}</h3>
      <div class="duel-final-scores">
        <div class="duel-final-player">
          <span class="player-name">${state.duel.p1Name}</span>
          <span class="player-pts" style="color:var(--primary-light)">${p1}</span>
          ${p1 > p2 ? `<span class="duel-winner-label">${t('duel.winner')}</span>` : ''}
        </div>
        <div style="display:flex;align-items:center;font-weight:800;color:var(--text-muted)">VS</div>
        <div class="duel-final-player">
          <span class="player-name">${state.duel.p2Name}</span>
          <span class="player-pts" style="color:var(--success)">${p2}</span>
          ${p2 > p1 ? `<span class="duel-winner-label">${t('duel.winner')}</span>` : ''}
        </div>
      </div>
      ${winnerHtml}
    `;
  } else {
    duelBox.classList.add('hidden');
  }

  // Review list
  const list = $('review-list');
  list.innerHTML = '';
  state.answers.forEach(a => {
    const div = document.createElement('div');
    div.className = 'review-item';
    div.innerHTML = `
      <span class="review-icon">${a.isCorrect ? '✅' : '❌'}</span>
      <div class="review-q">
        ${a.question}
        ${!a.isCorrect ? `<br><em>${t('results.youranswer')} ${a.chosen} · ${t('results.correctanswer')} ${a.correct}</em>` : ''}
      </div>
    `;
    list.appendChild(div);
  });

  // Show revision button if there were errors (non-revision mode)
  const hasErrors = state.answers.some(a => !a.isCorrect);
  const revBtn = $('revise-btn');
  revBtn.style.display = (hasErrors && state.mode !== 'revision') ? 'inline-flex' : 'none';

  // Save to history & leaderboard
  saveSession(pct, score, total);
}

function saveSession(pct, score, total) {
  const playerNameRaw = $('player-name').value.trim();
  const playerName = playerNameRaw || t('player.anonymous');
  const subLabel = state.subject && state.subject !== '__custom__' && getSubjects()[state.subject]
    ? getSubjects()[state.subject].label : t('subject.custom.label');

  const entry = {
    id: Date.now(),
    date: new Date().toISOString(),
    playerName,
    subject: subLabel,
    mode: state.mode,
    score,
    total,
    pct,
    timeUsed: Math.round(state.totalTimeUsed),
  };

  const history = lsGet(LS.history);
  history.unshift(entry);
  lsSet(LS.history, history.slice(0, 100)); // keep last 100

  // Leaderboard (only with a real name)
  if (playerNameRaw) {
    const lb = lsGet(LS.leaderboard);
    lb.push({ name: playerName, pct, score, total, subject: subLabel, date: new Date().toISOString() });
    lb.sort((a, b) => b.pct - a.pct || b.score - a.score);
    lsSet(LS.leaderboard, lb.slice(0, 50));
  }
}

// ═══════════════════════════════════════════
//  REVISION MODE
// ═══════════════════════════════════════════
function startRevision() {
  state.mode = 'revision';
  // subject stays the same — revision mode uses the wrong pool regardless
  startQuiz();
}

// ═══════════════════════════════════════════
//  HISTORY SCREEN
// ═══════════════════════════════════════════
function renderHistory() {
  const history = lsGet(LS.history);
  const sumEl   = $('history-summary');
  const listEl  = $('history-list');

  if (history.length === 0) {
    sumEl.innerHTML = '';
    listEl.innerHTML = `<div class="empty-state"><i class="fa-solid fa-chart-line"></i><p>${t('history.empty')}</p></div>`;
    return;
  }

  const avgPct  = Math.round(history.reduce((s, h) => s + h.pct, 0) / history.length);
  const bestPct = Math.max(...history.map(h => h.pct));
  const totalQ  = history.reduce((s, h) => s + h.total, 0);

  sumEl.innerHTML = `
    <div class="hsummary-box"><div class="hsummary-val">${history.length}</div><div class="hsummary-lbl">${t('history.played')}</div></div>
    <div class="hsummary-box"><div class="hsummary-val">${avgPct}%</div><div class="hsummary-lbl">${t('history.average')}</div></div>
    <div class="hsummary-box"><div class="hsummary-val">${bestPct}%</div><div class="hsummary-lbl">${t('history.best')}</div></div>
    <div class="hsummary-box"><div class="hsummary-val">${totalQ}</div><div class="hsummary-lbl">${t('history.answered')}</div></div>
  `;

  listEl.innerHTML = '';
  history.forEach(h => {
    const cls = h.pct >= 70 ? 'excellent' : h.pct >= 45 ? 'good' : 'bad';
    const modeLabel = {
      normal: t('history.mode.normal'), exam: t('history.mode.exam'),
      revision: t('history.mode.revision'), duel: t('history.mode.duel'),
    }[h.mode] || h.mode;
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <div class="history-score-badge ${cls}">${h.pct}%</div>
      <div class="history-info">
        <div class="hi-subject">${h.playerName} — ${h.subject}</div>
        <div class="hi-meta">${h.score} / ${h.total} · ${modeLabel} · ${formatTime(h.timeUsed)}</div>
        <div class="hi-date">${formatDate(h.date)}</div>
      </div>
    `;
    listEl.appendChild(div);
  });
}

function clearHistory() {
  requirePin(t('history.clear'), t('history.cleardesc'), () => {
    lsSet(LS.history, []);
    renderHistory();
  });
}

// ═══════════════════════════════════════════
//  LEADERBOARD SCREEN
// ═══════════════════════════════════════════
function renderLeaderboard() {
  const lb   = lsGet(LS.leaderboard);
  const listEl = $('leaderboard-list');

  if (lb.length === 0) {
    listEl.innerHTML = `<div class="empty-state"><i class="fa-solid fa-trophy"></i><p>${t('lb.empty').replace('\n', '<br>')}</p></div>`;
    return;
  }

  const rankIcons = ['🥇', '🥈', '🥉'];
  const rankClass = ['gold', 'silver', 'bronze'];

  listEl.innerHTML = '';
  lb.forEach((entry, i) => {
    const div = document.createElement('div');
    div.className = 'lb-item';
    const rIcon = i < 3 ? rankIcons[i] : `#${i+1}`;
    const rClass = i < 3 ? rankClass[i] : 'other';
    div.innerHTML = `
      <div class="lb-rank ${rClass}">${rIcon}</div>
      <div>
        <div class="lb-name">${entry.name}</div>
        <div class="lb-meta">${entry.subject} · ${entry.score}/${entry.total} · ${formatDate(entry.date)}</div>
      </div>
      <div class="lb-score">${entry.pct}%</div>
    `;
    listEl.appendChild(div);
  });
}

function clearLeaderboard() {
  requirePin(t('lb.clear'), t('lb.cleardesc'), () => {
    lsSet(LS.leaderboard, []);
    renderLeaderboard();
  });
}

// ═══════════════════════════════════════════
//  CUSTOM QUESTIONS
// ═══════════════════════════════════════════
let _customCorrectIdx = -1;

function setCorrectCustom(idx) {
  _customCorrectIdx = idx;
  document.querySelectorAll('.cq-letter-btn').forEach((b, i) => {
    b.classList.toggle('selected', i === idx);
  });
}

function saveCustomQuestion() {
  const question = $('cq-question').value.trim();
  const category = $('cq-category').value.trim();
  const inputs   = document.querySelectorAll('.cq-choice-input');
  const choices  = Array.from(inputs).map(i => i.value.trim());
  const explanation = $('cq-explanation').value.trim();
  const errEl    = $('cq-error');

  // Validate
  if (!question) { showFormError(t('error.question')); return; }
  if (!category) { showFormError(t('error.category')); return; }
  if (choices.some(c => !c)) { showFormError(t('error.choices')); return; }
  if (_customCorrectIdx < 0) { showFormError(t('error.correct')); return; }

  errEl.classList.add('hidden');

  const custom = lsGet(LS.custom);
  custom.push({ id: Date.now(), question, choices, correct: _customCorrectIdx, explanation, _cat: category });
  lsSet(LS.custom, custom);

  // Reset form
  $('cq-question').value = '';
  $('cq-category').value = '';
  $('cq-explanation').value = '';
  inputs.forEach(i => i.value = '');
  _customCorrectIdx = -1;
  document.querySelectorAll('.cq-letter-btn').forEach(b => b.classList.remove('selected'));

  renderCustomList();
  // Refresh home subject grid to show custom card
  initHome();
}

function showFormError(msg) {
  const el = $('cq-error');
  el.textContent = msg;
  el.classList.remove('hidden');
}

function renderCustomList() {
  const custom = lsGet(LS.custom);
  const listEl = $('custom-list');

  if (custom.length === 0) {
    listEl.innerHTML = `<div class="empty-state"><i class="fa-solid fa-pen-to-square"></i><p>${t('custom.empty')}</p></div>`;
    return;
  }

  listEl.innerHTML = '';
  custom.forEach((q, i) => {
    const div = document.createElement('div');
    div.className = 'custom-item';
    div.innerHTML = `
      <div class="custom-item-body">
        <div class="custom-item-q">${q.question}</div>
        <div class="custom-item-cat"><i class="fa-solid fa-tag"></i> ${q._cat} · ${t('custom.correctanswer')} ${LETTERS[q.correct]}) ${q.choices[q.correct]}</div>
      </div>
      <button class="custom-delete-btn" onclick="deleteCustomQuestion(${q.id})">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    listEl.appendChild(div);
  });
}

function deleteCustomQuestion(id) {
  requirePin(t('custom.delete'), t('custom.deletedesc'), () => {
    lsSet(LS.custom, lsGet(LS.custom).filter(q => q.id !== id));
    renderCustomList();
    initHome();
  });
}

// ═══════════════════════════════════════════
//  PIN PROTECTION
// ═══════════════════════════════════════════
const DEFAULT_PIN = '1234';
let _pinCallback = null;

function getPin() {
  return localStorage.getItem('qcm_admin_pin') || DEFAULT_PIN;
}

function requirePin(title, desc, onSuccess) {
  _pinCallback = onSuccess;
  document.getElementById('pin-modal-title').textContent = title;
  document.getElementById('pin-modal-desc').textContent = desc;

  // Reset champs principal
  document.querySelectorAll('#pin-inputs .pin-digit').forEach(i => { i.value = ''; i.classList.remove('error'); });
  document.getElementById('pin-error').classList.add('hidden');

  // Reset section changement PIN
  document.getElementById('change-pin-form').classList.add('hidden');
  document.getElementById('verify-current-pin-step').classList.remove('hidden');
  document.getElementById('new-pin-step').classList.add('hidden');
  document.querySelectorAll('.current-pin-digit').forEach(i => { i.value = ''; i.classList.remove('error'); });
  document.querySelectorAll('.new-pin-digit').forEach(i => { i.value = ''; i.classList.remove('error'); });
  document.getElementById('current-pin-error').classList.add('hidden');
  document.getElementById('pin-change-success').classList.add('hidden');

  document.getElementById('pin-overlay').classList.remove('hidden');

  // Auto-avance sur les champs
  setupPinInputs('#pin-inputs .pin-digit', confirmPin);
  setupPinInputs('.current-pin-digit', verifyCurrentPin);
  setupPinInputs('.new-pin-digit', savePinChange);

  setTimeout(() => document.querySelector('#pin-inputs .pin-digit').focus(), 50);
}

function setupPinInputs(selector, onComplete) {
  const inputs = document.querySelectorAll(selector);
  inputs.forEach((input, idx) => {
    input.oninput = () => {
      input.value = input.value.replace(/\D/g, '');
      if (input.value && idx < inputs.length - 1) inputs[idx + 1].focus();
      if (input.value && idx === inputs.length - 1) onComplete();
    };
    input.onkeydown = e => {
      if (e.key === 'Backspace' && !input.value && idx > 0) inputs[idx - 1].focus();
    };
  });
}

function closePinModal(event) {
  if (event && event.target !== document.getElementById('pin-overlay')) return;
  document.getElementById('pin-overlay').classList.add('hidden');
  _pinCallback = null;
}

function confirmPin() {
  const entered = [...document.querySelectorAll('#pin-inputs .pin-digit')].map(i => i.value).join('');
  if (entered.length < 4) return;
  if (entered === getPin()) {
    document.getElementById('pin-overlay').classList.add('hidden');
    if (_pinCallback) { _pinCallback(); _pinCallback = null; }
  } else {
    document.querySelectorAll('#pin-inputs .pin-digit').forEach(i => {
      i.classList.add('error');
      setTimeout(() => i.classList.remove('error'), 400);
      i.value = '';
    });
    document.getElementById('pin-error').classList.remove('hidden');
    document.querySelector('#pin-inputs .pin-digit').focus();
  }
}

function toggleChangePinForm() {
  const form = document.getElementById('change-pin-form');
  const isHidden = form.classList.toggle('hidden');
  if (!isHidden) {
    // Réinitialiser les deux étapes à chaque ouverture
    document.getElementById('verify-current-pin-step').classList.remove('hidden');
    document.getElementById('new-pin-step').classList.add('hidden');
    document.querySelectorAll('.current-pin-digit').forEach(i => { i.value = ''; i.classList.remove('error'); });
    document.getElementById('current-pin-error').classList.add('hidden');
    document.getElementById('pin-change-success').classList.add('hidden');
    setTimeout(() => document.querySelector('.current-pin-digit').focus(), 50);
  }
}

function verifyCurrentPin() {
  const entered = [...document.querySelectorAll('.current-pin-digit')].map(i => i.value).join('');
  if (entered.length < 4) return;
  if (entered === getPin()) {
    // Identité vérifiée → passer à l'étape 2
    document.getElementById('verify-current-pin-step').classList.add('hidden');
    document.getElementById('new-pin-step').classList.remove('hidden');
    setTimeout(() => document.querySelector('.new-pin-digit').focus(), 50);
  } else {
    document.querySelectorAll('.current-pin-digit').forEach(i => {
      i.classList.add('error');
      setTimeout(() => i.classList.remove('error'), 400);
      i.value = '';
    });
    document.getElementById('current-pin-error').classList.remove('hidden');
    document.querySelector('.current-pin-digit').focus();
  }
}

function savePinChange() {
  const newPin = [...document.querySelectorAll('.new-pin-digit')].map(i => i.value).join('');
  if (newPin.length < 4) return;
  localStorage.setItem('qcm_admin_pin', newPin);
  document.getElementById('pin-change-success').classList.remove('hidden');
  document.querySelectorAll('.new-pin-digit').forEach(i => i.value = '');
  setTimeout(() => {
    document.getElementById('change-pin-form').classList.add('hidden');
    document.getElementById('pin-change-success').classList.add('hidden');
  }, 1800);
}

// ═══════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  initHome();
  showScreen('home-screen');
  _applyStaticTranslations();
  updateLangBtn();
});
