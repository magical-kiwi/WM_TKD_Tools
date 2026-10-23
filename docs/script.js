const WB_QuizButton = document.getElementById('WB_Quiz');
const GB_QuizButton = document.getElementById('GB_Quiz');
const BB_QuizButton = document.getElementById('BB_Quiz');
const RB_QuizButton = document.getElementById('RB_Quiz');
const CDB_QuizButton = document.getElementById('CDB_Quiz');

const params = new URLSearchParams(window.location.search);
const disable_cdb_test = params.get("cdb_test") == null;

WB_QuizButton.disabled = true;
//CDB_QuizButton.disabled = disable_cdb_test;

WB_QuizButton.addEventListener('click', () => window.location.href = 'quiz/WB_Quiz/WB.html');
GB_QuizButton.addEventListener('click', () => window.location.href = 'quiz/GB_Quiz/GB.html');
BB_QuizButton.addEventListener('click', () => window.location.href = 'quiz/BB_Quiz/BB.html');
RB_QuizButton.addEventListener('click', () => window.location.href = 'quiz/RB_Quiz/RB.html');
CDB_QuizButton.addEventListener('click', () => window.location.href = 'quiz/CDB_Quiz/CDB.html');