// ===== STATE =====
const state = {
  subject: null,
  category: null,
  questions: [],
  currentIndex: 0,
  score: 0,
  answered: false,
  answers: [],       // { question, correct, chosen, isCorrect }
  timer: null,
  timeLeft: 0,
  totalTime: 0,
  timePerQuestion: 30,
  totalTimeUsed: 0,
};

// ===== HELPERS =====
const $ = id => document.getElementById(id);
const letters = ['A', 'B', 'C', 'D'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// ===== SCREENS =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ===== HOME =====
function initHome() {
  const grid = $('subjects-grid');
  grid.innerHTML = '';

  const subjectKeys = Object.keys(SUBJECTS);

  subjectKeys.forEach(key => {
    const sub = SUBJECTS[key];
    const totalQ = sub.categories.reduce((s, c) => s + c.questions.length, 0);

    const card = document.createElement('div');
    card.className = 'subject-card';
    card.dataset.key = key;
    card.innerHTML = `
      <div class="subject-icon">${sub.icon}</div>
      <div class="subject-name">${sub.label}</div>
      <div class="subject-count">${sub.categories.length} catégories · ${totalQ} questions</div>
    `;
    card.addEventListener('click', () => selectSubject(key, card));
    grid.appendChild(card);
  });

  // Placeholder "bientôt"
  ['Mathématiques', 'Physique', 'Histoire'].forEach(name => {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.style.opacity = '0.45';
    card.style.cursor = 'not-allowed';
    const icons = { 'Mathématiques': '📐', 'Physique': '⚛️', 'Histoire': '📜' };
    card.innerHTML = `
      <div class="badge-new">Bientôt</div>
      <div class="subject-icon">${icons[name]}</div>
      <div class="subject-name">${name}</div>
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
  SUBJECTS[key].categories.forEach((cat, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${cat.name} (${cat.questions.length} questions)`;
    sel.appendChild(opt);
  });
}

// ===== START QUIZ =====
function startQuiz() {
  if (!state.subject) return;

  const sub = SUBJECTS[state.subject];
  const catVal = $('category-select').value;
  const countVal = parseInt($('count-select').value);
  state.timePerQuestion = parseInt($('time-select').value);

  let pool = [];
  if (catVal === 'all') {
    sub.categories.forEach((cat, ci) => {
      cat.questions.forEach(q => pool.push({ ...q, _cat: cat.name }));
    });
  } else {
    const cat = sub.categories[parseInt(catVal)];
    cat.questions.forEach(q => pool.push({ ...q, _cat: cat.name }));
  }

  pool = shuffle(pool);
  state.questions = pool.slice(0, Math.min(countVal, pool.length));
  state.currentIndex = 0;
  state.score = 0;
  state.answers = [];
  state.totalTimeUsed = 0;

  showScreen('quiz-screen');
  renderQuestion();
}

// ===== QUIZ =====
function renderQuestion() {
  const q = state.questions[state.currentIndex];
  const total = state.questions.length;

  // Header
  $('quiz-subject-badge').textContent = SUBJECTS[state.subject].label;
  $('quiz-category').textContent = q._cat;
  $('quiz-score').innerHTML = `Score : <span>${state.score}</span>`;

  // Progress
  $('progress-text').textContent = `Question ${state.currentIndex + 1} / ${total}`;
  $('progress-fill').style.width = `${((state.currentIndex) / total) * 100}%`;

  // Question
  $('question-number').textContent = `Question ${state.currentIndex + 1}`;
  $('question-text').textContent = q.question;

  // Mélanger les réponses : on crée des paires {text, isCorrect} puis on mélange
  const correctText = q.choices[q.correct];
  const shuffledChoices = shuffle(q.choices.map((text, i) => ({ text, isCorrect: i === q.correct })));
  const newCorrectIndex = shuffledChoices.findIndex(c => c.isCorrect);

  // Stocker l'index correct recalculé pour handleAnswer
  state._currentCorrectIndex = newCorrectIndex;
  state._currentChoices = shuffledChoices.map(c => c.text);
  state._correctText = correctText;

  // Choices
  const grid = $('choices-grid');
  grid.innerHTML = '';
  shuffledChoices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `<span class="choice-letter">${letters[i]}</span><span>${choice.text}</span>`;
    btn.addEventListener('click', () => handleAnswer(i));
    grid.appendChild(btn);
  });

  // Explanation
  const exp = $('explanation');
  exp.classList.remove('visible');
  exp.textContent = '';

  // Next button
  $('next-btn').style.display = 'none';

  // Timer
  startTimer();
  state.answered = false;
}

function startTimer() {
  clearInterval(state.timer);
  state.timeLeft = state.timePerQuestion;
  state.totalTime = state.timePerQuestion;
  updateTimerUI();

  state.timer = setInterval(() => {
    state.timeLeft--;
    updateTimerUI();
    if (state.timeLeft <= 0) {
      clearInterval(state.timer);
      handleAnswer(-1); // temps écoulé
    }
  }, 1000);
}

function updateTimerUI() {
  const pct = (state.timeLeft / state.totalTime) * 100;
  const fill = $('timer-fill');
  fill.style.width = pct + '%';
  fill.className = 'timer-fill';
  if (pct <= 30) fill.classList.add('danger');
  else if (pct <= 60) fill.classList.add('warning');
  $('timer-text').textContent = state.timeLeft + 's';
}

function handleAnswer(chosenIndex) {
  if (state.answered) return;
  state.answered = true;
  clearInterval(state.timer);

  const timeUsed = state.totalTime - state.timeLeft;
  state.totalTimeUsed += timeUsed;

  const q = state.questions[state.currentIndex];
  const correctIndex = state._currentCorrectIndex;
  const isCorrect = chosenIndex === correctIndex;
  if (isCorrect) state.score++;

  // Colorize choices (basé sur les index du tableau mélangé)
  const btns = $('choices-grid').querySelectorAll('.choice-btn');
  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correctIndex) btn.classList.add('correct');
    else if (i === chosenIndex) btn.classList.add('wrong');
  });

  // Explanation
  const exp = $('explanation');
  exp.innerHTML = `<strong>${isCorrect ? '✓ Bonne réponse !' : chosenIndex === -1 ? '⏱ Temps écoulé !' : '✗ Mauvaise réponse.'}</strong> ${q.explanation}`;
  exp.classList.add('visible');

  // Save answer (on utilise les textes des choix mélangés)
  state.answers.push({
    question: q.question,
    correct: state._correctText,
    chosen: chosenIndex >= 0 ? state._currentChoices[chosenIndex] : 'Aucune réponse',
    isCorrect,
  });

  // Update score display
  $('quiz-score').innerHTML = `Score : <span>${state.score}</span>`;

  // Show next
  $('next-btn').style.display = 'inline-flex';
  $('next-btn').textContent = state.currentIndex + 1 < state.questions.length ? 'Question suivante →' : 'Voir les résultats →';
}

function nextQuestion() {
  state.currentIndex++;
  if (state.currentIndex < state.questions.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

// ===== RESULTS =====
function showResults() {
  showScreen('results-screen');
  const total = state.questions.length;
  const pct = Math.round((state.score / total) * 100);

  // Emoji & titre
  let emoji, title;
  if (pct >= 80) { emoji = '🏆'; title = 'Excellent travail !'; }
  else if (pct >= 60) { emoji = '👍'; title = 'Pas mal !'; }
  else if (pct >= 40) { emoji = '📚'; title = 'Il faut réviser !'; }
  else { emoji = '💪'; title = 'Continuez à pratiquer !'; }

  $('results-emoji').textContent = emoji;
  $('results-title').textContent = title;
  $('results-subtitle').textContent = `${SUBJECTS[state.subject].label} · ${state.questions.length} questions`;

  // Score circle
  const circle = $('score-circle');
  circle.className = 'score-circle';
  if (pct >= 70) circle.classList.add('excellent');
  else if (pct >= 45) circle.classList.add('good');
  else circle.classList.add('bad');
  $('score-pct').textContent = pct + '%';
  $('score-fraction').textContent = `${state.score} / ${total}`;

  // Stats
  const wrong = total - state.score;
  $('stat-correct').textContent = state.score;
  $('stat-wrong').textContent = wrong;
  $('stat-time').textContent = formatTime(Math.round(state.totalTimeUsed));

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
}

function restartQuiz() {
  startQuiz();
}

function goHome() {
  clearInterval(state.timer);
  showScreen('home-screen');
}

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
  initHome();
  showScreen('home-screen');
  $('start-btn').disabled = true;
});
