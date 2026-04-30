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
  return d.toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
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
  Object.keys(SUBJECTS).forEach(key => {
    const sub = SUBJECTS[key];
    const totalQ = sub.categories.reduce((s, c) => s + c.questions.length, 0);
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.dataset.key = key;
    card.innerHTML = `
      <div class="subject-icon" style="background:${sub.color}22;box-shadow:0 0 0 1px ${sub.color}44">
        <i class="${sub.icon}" style="color:${sub.color}"></i>
      </div>
      <div class="subject-name">${sub.label}</div>
      <div class="subject-count">${sub.categories.length} catégories · ${totalQ} questions</div>
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
      <div class="subject-name">Mes questions</div>
      <div class="subject-count">1 catégorie · ${custom.length} questions</div>
    `;
    card.addEventListener('click', () => selectSubject('__custom__', card));
    grid.appendChild(card);
  }

  // Coming soon placeholders
  [{ name:'Physique', icon:'fa-solid fa-atom' }, { name:'Histoire', icon:'fa-solid fa-landmark' }, { name:'Chimie', icon:'fa-solid fa-flask' }]
    .forEach(s => {
      const card = document.createElement('div');
      card.className = 'subject-card';
      card.style.cssText = 'opacity:.4;cursor:not-allowed';
      card.innerHTML = `
        <div class="badge-new">Bientôt</div>
        <div class="subject-icon" style="background:#ffffff11"><i class="${s.icon}" style="color:#94a3b8"></i></div>
        <div class="subject-name">${s.name}</div>
        <div class="subject-count">À venir...</div>
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
  $('start-btn').disabled = false;
}

function populateCategorySelect(key) {
  const sel = $('category-select');
  sel.innerHTML = '<option value="all">Toutes les catégories</option>';
  if (!key) return;
  if (key === '__custom__') return;
  SUBJECTS[key].categories.forEach((cat, i) => {
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

  if (isRevision) {
    const wrong = lsGet(LS.wrong);
    const info = wrong.length > 0
      ? `${wrong.length} question(s) à réviser depuis votre dernière session`
      : 'Aucune erreur à réviser — jouez d\'abord une partie !';
    // Show inline info
    $('start-btn').disabled = wrong.length === 0 || !state.subject;
  } else {
    $('start-btn').disabled = !state.subject;
  }
}

// ═══════════════════════════════════════════
//  START QUIZ
// ═══════════════════════════════════════════
function startQuiz() {
  if (!state.subject) return;

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
    pool = custom.map(q => ({ ...q, _cat: q._cat || 'Mes questions' }));

  } else {
    const sub = SUBJECTS[state.subject];
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
  const p1 = $('player-name').value.trim() || 'Joueur 1';
  const p2 = $('player2-name').value.trim() || 'Joueur 2';
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
    const sub = SUBJECTS[state.subject];
    $('quiz-subject-badge').textContent = sub.label;
    $('quiz-subject-badge').style.cssText = `background:${sub.color}22;color:${sub.color};border-color:${sub.color}55`;
  } else {
    $('quiz-subject-badge').textContent = state.mode === 'revision' ? 'Révision' : 'Mes questions';
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
  $('quiz-score').innerHTML = `Score : <span>${state.score}</span>`;
  $('progress-text').textContent = `Question ${state.currentIndex + 1} / ${total}`;
  $('progress-fill').style.width = `${(state.currentIndex / total) * 100}%`;
  $('question-number').textContent = `Question ${state.currentIndex + 1}`;
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
    state.answers.push({ question: q.question, correct: state._correctText, chosen: 'Non répondu', isCorrect: false });
  }
  // Fill remaining as unanswered
  for (let i = state.currentIndex + 1; i < state.questions.length; i++) {
    const q = state.questions[i];
    state.answers.push({ question: q.question, correct: q.choices[q.correct], chosen: 'Non répondu', isCorrect: false });
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
    const label = isCorrect ? '✓ Bonne réponse !' : chosenIndex === -1 ? '⏱ Temps écoulé !' : '✗ Mauvaise réponse.';
    exp.innerHTML = `<strong>${label}</strong> ${q.explanation || ''}`;
    exp.classList.add('visible');
  } else {
    // Exam: disable chosen button only
    btns.forEach(b => b.disabled = true);
  }

  state.answers.push({
    question: q.question,
    correct: state._correctText,
    chosen: chosenIndex >= 0 ? state._choices[chosenIndex] : 'Aucune réponse',
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

  $('quiz-score').innerHTML = `Score : <span>${state.score}</span>`;
  $('next-btn').style.display = 'inline-flex';
  $('next-btn').textContent = state.currentIndex + 1 < state.questions.length ? 'Question suivante →' : 'Voir les résultats →';
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
  if (state.duel.p1Choice === -1) lines.push(`${state.duel.p1Name} : temps écoulé`);
  else lines.push(`${state.duel.p1Name} : ${p1ok ? '✓ Bonne réponse' : '✗ Mauvaise réponse'}`);
  if (state.duel.p2Choice === -1) lines.push(`${state.duel.p2Name} : temps écoulé`);
  else lines.push(`${state.duel.p2Name} : ${p2ok ? '✓ Bonne réponse' : '✗ Mauvaise réponse'}`);
  exp.innerHTML = `<strong>${lines.join(' — ')}</strong> ${q.explanation || ''}`;
  exp.classList.add('visible');

  state.answers.push({
    question: q.question,
    correct: state._correctText,
    chosen: state.duel.p1Choice >= 0 ? state._choices[state.duel.p1Choice] : 'Aucune',
    isCorrect: p1ok,
    duel: { p1ok, p2ok },
  });

  $('next-btn').style.display = 'inline-flex';
  $('next-btn').textContent = state.currentIndex + 1 < state.questions.length ? 'Question suivante →' : 'Voir les résultats →';
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
  if (pct >= 80) { icon = '🏆'; title = 'Excellent travail !'; }
  else if (pct >= 60) { icon = '👍'; title = 'Pas mal !'; }
  else if (pct >= 40) { icon = '📚'; title = 'Continuez à réviser !'; }
  else { icon = '💪'; title = 'Il faut s\'entraîner !'; }

  $('results-icon').textContent = icon;
  $('results-title').textContent = title;

  const modLabel = { normal:'Mode Normal', exam:'Examen blanc', revision:'Révision', duel:'Mode Duel' }[state.mode];
  const subLabel = state.subject && state.subject !== '__custom__' && SUBJECTS[state.subject]
    ? SUBJECTS[state.subject].label : 'Questions perso';
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
    if (p1 > p2)       winnerHtml = `<div style="margin-top:12px;font-size:.95rem">🏆 <strong>${state.duel.p1Name}</strong> remporte le duel !</div>`;
    else if (p2 > p1)  winnerHtml = `<div style="margin-top:12px;font-size:.95rem">🏆 <strong>${state.duel.p2Name}</strong> remporte le duel !</div>`;
    else               winnerHtml = `<div style="margin-top:12px;font-size:.95rem">🤝 Égalité parfaite !</div>`;
    duelBox.innerHTML = `
      <h3>Résultat du duel</h3>
      <div class="duel-final-scores">
        <div class="duel-final-player">
          <span class="player-name">${state.duel.p1Name}</span>
          <span class="player-pts" style="color:var(--primary-light)">${p1}</span>
          ${p1 > p2 ? '<span class="duel-winner-label">Vainqueur 🏆</span>' : ''}
        </div>
        <div style="display:flex;align-items:center;font-weight:800;color:var(--text-muted)">VS</div>
        <div class="duel-final-player">
          <span class="player-name">${state.duel.p2Name}</span>
          <span class="player-pts" style="color:var(--success)">${p2}</span>
          ${p2 > p1 ? '<span class="duel-winner-label">Vainqueur 🏆</span>' : ''}
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
        ${!a.isCorrect ? `<br><em>Votre réponse : ${a.chosen} · Bonne réponse : ${a.correct}</em>` : ''}
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
  const playerName = $('player-name').value.trim() || 'Anonyme';
  const subLabel = state.subject && state.subject !== '__custom__' && SUBJECTS[state.subject]
    ? SUBJECTS[state.subject].label : 'Questions perso';

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
  if (playerName !== 'Anonyme' && playerName !== '') {
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
    listEl.innerHTML = `<div class="empty-state"><i class="fa-solid fa-chart-line"></i><p>Aucune session jouée pour l'instant.</p></div>`;
    return;
  }

  const avgPct  = Math.round(history.reduce((s, h) => s + h.pct, 0) / history.length);
  const bestPct = Math.max(...history.map(h => h.pct));
  const totalQ  = history.reduce((s, h) => s + h.total, 0);

  sumEl.innerHTML = `
    <div class="hsummary-box"><div class="hsummary-val">${history.length}</div><div class="hsummary-lbl">Parties jouées</div></div>
    <div class="hsummary-box"><div class="hsummary-val">${avgPct}%</div><div class="hsummary-lbl">Moyenne</div></div>
    <div class="hsummary-box"><div class="hsummary-val">${bestPct}%</div><div class="hsummary-lbl">Meilleur score</div></div>
    <div class="hsummary-box"><div class="hsummary-val">${totalQ}</div><div class="hsummary-lbl">Questions répondues</div></div>
  `;

  listEl.innerHTML = '';
  history.forEach(h => {
    const cls = h.pct >= 70 ? 'excellent' : h.pct >= 45 ? 'good' : 'bad';
    const modeLabel = { normal:'Normal', exam:'Examen', revision:'Révision', duel:'Duel' }[h.mode] || h.mode;
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
  requirePin('Effacer l\'historique', 'Cette action supprimera définitivement toutes les sessions enregistrées.', () => {
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
    listEl.innerHTML = `<div class="empty-state"><i class="fa-solid fa-trophy"></i><p>Aucun score enregistré.<br>Entrez votre prénom avant de jouer !</p></div>`;
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
  requirePin('Effacer le classement', 'Cette action supprimera définitivement tous les scores enregistrés.', () => {
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
  if (!question) { showFormError('Veuillez entrer une question.'); return; }
  if (!category) { showFormError('Veuillez entrer une catégorie.'); return; }
  if (choices.some(c => !c)) { showFormError('Veuillez remplir les 4 choix de réponse.'); return; }
  if (_customCorrectIdx < 0) { showFormError('Veuillez sélectionner la bonne réponse en cliquant sur A, B, C ou D.'); return; }

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
    listEl.innerHTML = `<div class="empty-state"><i class="fa-solid fa-pen-to-square"></i><p>Aucune question personnalisée pour l'instant.</p></div>`;
    return;
  }

  listEl.innerHTML = '';
  custom.forEach((q, i) => {
    const div = document.createElement('div');
    div.className = 'custom-item';
    div.innerHTML = `
      <div class="custom-item-body">
        <div class="custom-item-q">${q.question}</div>
        <div class="custom-item-cat"><i class="fa-solid fa-tag"></i> ${q._cat} · Bonne réponse : ${LETTERS[q.correct]}) ${q.choices[q.correct]}</div>
      </div>
      <button class="custom-delete-btn" onclick="deleteCustomQuestion(${q.id})">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    listEl.appendChild(div);
  });
}

function deleteCustomQuestion(id) {
  requirePin('Supprimer la question', 'Cette action supprimera définitivement cette question personnalisée.', () => {
    lsSet(LS.custom, lsGet(LS.custom).filter(q => q.id !== id));
    renderCustomList();
    initHome();
  });
}

// ═══════════════════════════════════════════
//  PIN PROTECTION
// ═══════════════════════════════════════════
const DEFAULT_PIN = '1234';
let _pinCallback = null; // function to call after successful PIN

function getPin() {
  return localStorage.getItem('qcm_admin_pin') || DEFAULT_PIN;
}

function requirePin(title, desc, onSuccess) {
  _pinCallback = onSuccess;
  $('pin-modal-title').textContent = title;
  $('pin-modal-desc').textContent  = desc;

  // Reset fields
  document.querySelectorAll('.pin-digit:not(.new-pin-digit)').forEach(d => {
    d.value = '';
    d.classList.remove('error', 'filled');
  });
  $('pin-error').classList.add('hidden');
  $('change-pin-form').classList.add('hidden');
  $('pin-change-success').classList.add('hidden');
  document.querySelectorAll('.new-pin-digit').forEach(d => d.value = '');

  $('pin-overlay').classList.remove('hidden');

  // Focus first digit
  const digits = document.querySelectorAll('.pin-digit:not(.new-pin-digit)');
  digits[0].focus();

  // Wire up auto-advance
  digits.forEach((digit, i) => {
    digit.oninput = () => {
      digit.value = digit.value.replace(/\D/g, '').slice(-1);
      digit.classList.toggle('filled', digit.value !== '');
      digit.classList.remove('error');
      $('pin-error').classList.add('hidden');
      if (digit.value && i < digits.length - 1) digits[i + 1].focus();
    };
    digit.onkeydown = e => {
      if (e.key === 'Backspace' && !digit.value && i > 0) digits[i - 1].focus();
      if (e.key === 'Enter') confirmPin();
    };
  });
}

function closePinModal(event) {
  // Close only if click on overlay background
  if (event && event.target !== $('pin-overlay')) return;
  $('pin-overlay').classList.add('hidden');
  _pinCallback = null;
}

function confirmPin() {
  const digits  = document.querySelectorAll('.pin-digit:not(.new-pin-digit)');
  const entered = Array.from(digits).map(d => d.value).join('');

  if (entered.length < 4) {
    showPinError('Entrez les 4 chiffres du PIN.');
    return;
  }

  if (entered === getPin()) {
    $('pin-overlay').classList.add('hidden');
    if (_pinCallback) { _pinCallback(); _pinCallback = null; }
  } else {
    showPinError('Code incorrect, réessayez.');
    digits.forEach(d => { d.value = ''; d.classList.add('error'); d.classList.remove('filled'); });
    digits[0].focus();
  }
}

function showPinError(msg) {
  const el = $('pin-error');
  el.textContent = msg;
  el.classList.remove('hidden');
}

function toggleChangePinForm() {
  const form = $('change-pin-form');
  form.classList.toggle('hidden');
  if (!form.classList.contains('hidden')) {
    const newDigits = document.querySelectorAll('.new-pin-digit');
    newDigits.forEach((digit, i) => {
      digit.value = '';
      digit.oninput = () => {
        digit.value = digit.value.replace(/\D/g, '').slice(-1);
        if (digit.value && i < newDigits.length - 1) newDigits[i + 1].focus();
      };
      digit.onkeydown = e => {
        if (e.key === 'Backspace' && !digit.value && i > 0) newDigits[i - 1].focus();
        if (e.key === 'Enter') savePinChange();
      };
    });
    newDigits[0].focus();
  }
}

function savePinChange() {
  const newPin = Array.from(document.querySelectorAll('.new-pin-digit')).map(d => d.value).join('');
  if (newPin.length < 4) {
    alert('Entrez un PIN de 4 chiffres.');
    return;
  }
  localStorage.setItem('qcm_admin_pin', newPin);
  $('pin-change-success').classList.remove('hidden');
  setTimeout(() => $('pin-change-success').classList.add('hidden'), 2500);
  document.querySelectorAll('.new-pin-digit').forEach(d => d.value = '');
}

// ═══════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  initHome();
  showScreen('home-screen');
});
