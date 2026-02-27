const WB_QuizButton = document.getElementById('WB_Quiz');
const CDB_QuizButton = document.getElementById('CDB_Quiz');

const params = new URLSearchParams(window.location.search);
const disable_cdb_test = params.get("cdb_test") == null;

WB_QuizButton.disabled = true;
CDB_QuizButton.disabled = disable_cdb_test;