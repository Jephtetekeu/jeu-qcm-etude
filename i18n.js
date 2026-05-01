// ═══════════════════════════════════════════
//  INTERNATIONALIZATION (i18n)
// ═══════════════════════════════════════════

const TRANSLATIONS = {
  fr: {
    'app.title': 'QCM Étude',
    'app.subtitle': 'Testez vos connaissances',

    'nav.history': 'Historique',
    'nav.leaderboard': 'Classement',
    'nav.myquestions': 'Mes questions',

    'mode.normal': 'Normal',
    'mode.exam': 'Examen blanc',
    'mode.revision': 'Révision',
    'mode.duel': 'Duel',

    'settings.category': 'Catégorie',
    'settings.allcategories': 'Toutes les catégories',
    'settings.count': 'Nombre de questions',
    'settings.time': 'Temps / question',
    'settings.examtime': "Durée de l'examen",
    'settings.nolimit': 'Sans limite',
    'settings.allquestions': 'Toutes',

    'time.30min': '30 minutes',
    'time.1h': '1 heure',
    'time.1h30': '1 h 30',
    'time.2h': '2 heures',

    'player.name': 'Votre prénom',
    'player.nameplaceholder': 'Pour le classement...',
    'player.p2name': 'Joueur 2',
    'player.p2placeholder': 'Prénom du joueur 2...',
    'player.anonymous': 'Anonyme',
    'player.default1': 'Joueur 1',
    'player.default2': 'Joueur 2',

    'btn.start': 'Commencer',
    'btn.quit': 'Abandonner',
    'btn.next': 'Question suivante →',
    'btn.results': 'Voir les résultats →',
    'btn.home': 'Accueil',
    'btn.revise': 'Réviser erreurs',
    'btn.replay': 'Rejouer',
    'btn.cancel': 'Annuler',
    'btn.confirm': 'Confirmer',
    'btn.verify': 'Vérifier',
    'btn.addquestion': 'Ajouter la question',
    'btn.savepin': 'Enregistrer le nouveau PIN',

    'quiz.score': 'Score :',
    'quiz.correct': '✓ Bonne réponse !',
    'quiz.timeout': '⏱ Temps écoulé !',
    'quiz.wrong': '✗ Mauvaise réponse.',
    'quiz.unanswered': 'Non répondu',
    'quiz.noanswer': 'Aucune réponse',
    'quiz.revision': 'Révision',
    'quiz.myquestions': 'Mes questions',
    'quiz.question': 'Question',

    'results.excellent': 'Excellent travail !',
    'results.good': 'Pas mal !',
    'results.average': 'Continuez à réviser !',
    'results.bad': "Il faut s'entraîner !",
    'results.correct': 'Bonnes réponses',
    'results.wrong': 'Mauvaises réponses',
    'results.time': 'Temps utilisé',
    'results.summary': 'Récapitulatif',
    'results.youranswer': 'Votre réponse :',
    'results.correctanswer': 'Bonne réponse :',
    'results.mode.normal': 'Mode Normal',
    'results.mode.exam': 'Examen blanc',
    'results.mode.revision': 'Révision',
    'results.mode.duel': 'Mode Duel',

    'subject.categories': 'catégories',
    'subject.questions': 'questions',
    'subject.soon': 'Bientôt',
    'subject.comingsoon': 'À venir...',
    'subject.myquestions': 'Mes questions',
    'subject.mycategory': '1 catégorie',
    'subject.custom.label': 'Questions perso',
    'subject.physics': 'Physique',
    'subject.history2': 'Histoire',
    'subject.chemistry': 'Chimie',

    'duel.timeout': 'temps écoulé',
    'duel.correct': '✓ Bonne réponse',
    'duel.wrong': '✗ Mauvaise réponse',
    'duel.result': 'Résultat du duel',
    'duel.winner': 'Vainqueur 🏆',
    'duel.tie': '🤝 Égalité parfaite !',
    'duel.noanswer': 'Aucune',

    'history.title': 'Historique',
    'history.played': 'Parties jouées',
    'history.average': 'Moyenne',
    'history.best': 'Meilleur score',
    'history.answered': 'Questions répondues',
    'history.empty': "Aucune session jouée pour l'instant.",
    'history.clear': "Effacer l'historique",
    'history.cleardesc': 'Cette action supprimera définitivement toutes les sessions enregistrées.',
    'history.mode.normal': 'Normal',
    'history.mode.exam': 'Examen',
    'history.mode.revision': 'Révision',
    'history.mode.duel': 'Duel',

    'lb.title': 'Classement',
    'lb.empty': "Aucun score enregistré.\nEntrez votre prénom avant de jouer !",
    'lb.clear': 'Effacer le classement',
    'lb.cleardesc': 'Cette action supprimera définitivement tous les scores enregistrés.',

    'custom.title': 'Mes questions',
    'custom.addtitle': 'Ajouter une question',
    'custom.questionlabel': 'Question *',
    'custom.categorylabel': 'Catégorie *',
    'custom.answerlabel': 'Réponses — cliquez la lettre pour marquer la bonne réponse',
    'custom.explainlabel': 'Explication (optionnel)',
    'custom.questionplaceholder': 'Énoncé de votre question...',
    'custom.categoryplaceholder': 'Ex: Réseaux, Python, Bases de données...',
    'custom.explainplaceholder': 'Pourquoi cette réponse est-elle correcte ?',
    'custom.choiceA': 'Choix A...',
    'custom.choiceB': 'Choix B...',
    'custom.choiceC': 'Choix C...',
    'custom.choiceD': 'Choix D...',
    'custom.empty': "Aucune question personnalisée pour l'instant.",
    'custom.correctanswer': 'Bonne réponse :',
    'custom.delete': 'Supprimer la question',
    'custom.deletedesc': 'Cette action supprimera définitivement cette question personnalisée.',

    'error.question': 'Veuillez entrer une question.',
    'error.category': 'Veuillez entrer une catégorie.',
    'error.choices': 'Veuillez remplir les 4 choix de réponse.',
    'error.correct': 'Veuillez sélectionner la bonne réponse en cliquant sur A, B, C ou D.',

    'pin.title': 'Action protégée',
    'pin.desc': 'Entrez le code PIN administrateur pour continuer.',
    'pin.error': 'Code incorrect, réessayez.',
    'pin.changelink': 'Changer le code PIN',
    'pin.currentlabel': "PIN actuel (vérification d'identité)",
    'pin.currenterror': 'PIN actuel incorrect.',
    'pin.newlabel': 'Nouveau PIN (4 chiffres)',
    'pin.success': 'PIN mis à jour !',
  },

  en: {
    'app.title': 'Study Quiz',
    'app.subtitle': 'Test your knowledge',

    'nav.history': 'History',
    'nav.leaderboard': 'Leaderboard',
    'nav.myquestions': 'My questions',

    'mode.normal': 'Normal',
    'mode.exam': 'Mock Exam',
    'mode.revision': 'Revision',
    'mode.duel': 'Duel',

    'settings.category': 'Category',
    'settings.allcategories': 'All categories',
    'settings.count': 'Number of questions',
    'settings.time': 'Time / question',
    'settings.examtime': 'Exam duration',
    'settings.nolimit': 'No limit',
    'settings.allquestions': 'All',

    'time.30min': '30 minutes',
    'time.1h': '1 hour',
    'time.1h30': '1h 30',
    'time.2h': '2 hours',

    'player.name': 'Your name',
    'player.nameplaceholder': 'For the leaderboard...',
    'player.p2name': 'Player 2',
    'player.p2placeholder': "Player 2's name...",
    'player.anonymous': 'Anonymous',
    'player.default1': 'Player 1',
    'player.default2': 'Player 2',

    'btn.start': 'Start',
    'btn.quit': 'Quit',
    'btn.next': 'Next question →',
    'btn.results': 'See results →',
    'btn.home': 'Home',
    'btn.revise': 'Review errors',
    'btn.replay': 'Play again',
    'btn.cancel': 'Cancel',
    'btn.confirm': 'Confirm',
    'btn.verify': 'Verify',
    'btn.addquestion': 'Add question',
    'btn.savepin': 'Save new PIN',

    'quiz.score': 'Score:',
    'quiz.correct': '✓ Correct!',
    'quiz.timeout': "⏱ Time's up!",
    'quiz.wrong': '✗ Wrong answer.',
    'quiz.unanswered': 'Unanswered',
    'quiz.noanswer': 'No answer',
    'quiz.revision': 'Revision',
    'quiz.myquestions': 'My questions',
    'quiz.question': 'Question',

    'results.excellent': 'Excellent work!',
    'results.good': 'Not bad!',
    'results.average': 'Keep studying!',
    'results.bad': 'Keep practicing!',
    'results.correct': 'Correct answers',
    'results.wrong': 'Wrong answers',
    'results.time': 'Time used',
    'results.summary': 'Summary',
    'results.youranswer': 'Your answer:',
    'results.correctanswer': 'Correct answer:',
    'results.mode.normal': 'Normal Mode',
    'results.mode.exam': 'Mock Exam',
    'results.mode.revision': 'Revision',
    'results.mode.duel': 'Duel Mode',

    'subject.categories': 'categories',
    'subject.questions': 'questions',
    'subject.soon': 'Soon',
    'subject.comingsoon': 'Coming soon...',
    'subject.myquestions': 'My questions',
    'subject.mycategory': '1 category',
    'subject.custom.label': 'Custom questions',
    'subject.physics': 'Physics',
    'subject.history2': 'History',
    'subject.chemistry': 'Chemistry',

    'duel.timeout': "time's up",
    'duel.correct': '✓ Correct',
    'duel.wrong': '✗ Wrong answer',
    'duel.result': 'Duel result',
    'duel.winner': 'Winner 🏆',
    'duel.tie': '🤝 Perfect tie!',
    'duel.noanswer': 'None',

    'history.title': 'History',
    'history.played': 'Games played',
    'history.average': 'Average',
    'history.best': 'Best score',
    'history.answered': 'Questions answered',
    'history.empty': 'No sessions played yet.',
    'history.clear': 'Clear history',
    'history.cleardesc': 'This action will permanently delete all recorded sessions.',
    'history.mode.normal': 'Normal',
    'history.mode.exam': 'Exam',
    'history.mode.revision': 'Revision',
    'history.mode.duel': 'Duel',

    'lb.title': 'Leaderboard',
    'lb.empty': 'No scores recorded.\nEnter your name before playing!',
    'lb.clear': 'Clear leaderboard',
    'lb.cleardesc': 'This action will permanently delete all recorded scores.',

    'custom.title': 'My questions',
    'custom.addtitle': 'Add a question',
    'custom.questionlabel': 'Question *',
    'custom.categorylabel': 'Category *',
    'custom.answerlabel': 'Answers — click the letter to mark the correct answer',
    'custom.explainlabel': 'Explanation (optional)',
    'custom.questionplaceholder': 'Your question text...',
    'custom.categoryplaceholder': 'E.g.: Networks, Python, Databases...',
    'custom.explainplaceholder': 'Why is this answer correct?',
    'custom.choiceA': 'Choice A...',
    'custom.choiceB': 'Choice B...',
    'custom.choiceC': 'Choice C...',
    'custom.choiceD': 'Choice D...',
    'custom.empty': 'No custom questions yet.',
    'custom.correctanswer': 'Correct answer:',
    'custom.delete': 'Delete question',
    'custom.deletedesc': 'This action will permanently delete this custom question.',

    'error.question': 'Please enter a question.',
    'error.category': 'Please enter a category.',
    'error.choices': 'Please fill in all 4 answer choices.',
    'error.correct': 'Please select the correct answer by clicking A, B, C or D.',

    'pin.title': 'Protected action',
    'pin.desc': 'Enter the admin PIN to continue.',
    'pin.error': 'Incorrect code, please try again.',
    'pin.changelink': 'Change PIN',
    'pin.currentlabel': 'Current PIN (identity verification)',
    'pin.currenterror': 'Incorrect current PIN.',
    'pin.newlabel': 'New PIN (4 digits)',
    'pin.success': 'PIN updated!',
  },
};

// ───────────────────────────────────────────
//  Core functions
// ───────────────────────────────────────────
let _currentLang = localStorage.getItem('qcm_lang') || 'fr';

function getLang() { return _currentLang; }

function t(key) {
  return (TRANSLATIONS[_currentLang] && TRANSLATIONS[_currentLang][key])
      || (TRANSLATIONS['fr'] && TRANSLATIONS['fr'][key])
      || key;
}

function setLang(lang) {
  _currentLang = lang;
  localStorage.setItem('qcm_lang', lang);
  document.documentElement.lang = lang;
  _applyStaticTranslations();
}

function _applyStaticTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });
}
