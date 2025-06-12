const stepTemplate = document.getElementById('stepTemplate');
const staircase = document.getElementById('staircase');
const addDayBtn = document.getElementById('addDay');
const walker = document.getElementById('walker');
const scoreboard = document.getElementById('scoreboard');

let data = JSON.parse(localStorage.getItem('journalData') || '[]');

function updateScore() {
  const total = data.reduce((sum, d) => sum + Number(d.return || 0), 0);
  scoreboard.textContent = `Total Return: ${total.toFixed(2)}`;
}

function createStep(entry, index) {
  const clone = stepTemplate.content.cloneNode(true);
  const el = clone.querySelector('.step');
  const dateEl = clone.querySelector('.date');
  dateEl.textContent = entry.date;

  const riskInput = clone.querySelector('.risk');
  const returnInput = clone.querySelector('.return');
  const notesInput = clone.querySelector('.notes');
  const shotInput = clone.querySelector('.screenshot');
  const shotImg = clone.querySelector('.shot');

  riskInput.value = entry.risk || '';
  returnInput.value = entry.return || '';
  notesInput.value = entry.notes || '';
  if (entry.screenshot) {
    shotImg.src = entry.screenshot;
    shotImg.style.display = 'block';
  }

  riskInput.addEventListener('change', () => saveField(index, 'risk', riskInput.value));
  returnInput.addEventListener('change', () => {
    saveField(index, 'return', returnInput.value);
    updateScore();
  });
  notesInput.addEventListener('change', () => saveField(index, 'notes', notesInput.value));
  shotInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      shotImg.src = reader.result;
      shotImg.style.display = 'block';
      saveField(index, 'screenshot', reader.result);
    };
    reader.readAsDataURL(file);
  });

  el.style.height = 50 + index * 20 + 'px';
  staircase.appendChild(clone);
}

function saveField(index, field, value) {
  data[index][field] = value;
  localStorage.setItem('journalData', JSON.stringify(data));
}

function render() {
  staircase.innerHTML = '';
  data.forEach((entry, i) => createStep(entry, i));
  moveWalker();
  updateScore();
}

function moveWalker() {
  const stepWidth = 160; // approximate
  walker.style.left = data.length * stepWidth + 'px';
}

addDayBtn.addEventListener('click', () => {
  const today = new Date().toISOString().split('T')[0];
  data.push({ date: today });
  localStorage.setItem('journalData', JSON.stringify(data));
  createStep(data[data.length - 1], data.length - 1);
  moveWalker();
});

render();
