/* -------------------------------------------
   1) Puzzle Verileri
------------------------------------------- */
const puzzleCells = [
  // TEAL (yatay)
  { letter: "T", x: 200, y: 100 },
  { letter: "E", x: 250, y: 100 },
  { letter: "A", x: 300, y: 100 },
  { letter: "L", x: 350, y: 100 },
  // TALE (dikey), TEAL ile T harfini paylaşıyor
  { letter: "A", x: 200, y: 150 },
  { letter: "L", x: 200, y: 200 },
  { letter: "E", x: 200, y: 250 },
  // LATE (yatay), TALE ile T harfi üzerinde kesişiyor
  { letter: "L", x: 200, y: 200 },
  { letter: "A", x: 250, y: 200 },
  { letter: "T", x: 300, y: 200 },
  { letter: "E", x: 350, y: 200 },
  // ALE (yatay), TALE ile E harfi üzerinde kesişiyor
  { letter: "A", x: 100, y: 250 },
  { letter: "L", x: 150, y: 250 },
  { letter: "E", x: 200, y: 250 }
];

const puzzleWords = [
  { word: "TEAL", cellIndexes: [0, 1, 2, 3] },
  { word: "TALE", cellIndexes: [0, 4, 5, 6] },
  { word: "LATE", cellIndexes: [7, 8, 9, 10] },
  { word: "ALE",  cellIndexes: [11, 12, 13] }
];

const letters = ["T", "A", "L", "E"];

/* -------------------------------------------
   2) DOM Elemanlarını Oluşturma
------------------------------------------- */
const puzzleContainer = document.getElementById("puzzle");
const letterContainer  = document.getElementById("letter-container");
const lineContainer    = document.getElementById("line-container");

/* Puzzle hücrelerini DOM’a ekle */
puzzleCells.forEach((cell, index) => {
  const div = document.createElement("div");
  div.classList.add("cell", "hidden"); // Başlangıçta gizli
  div.style.left = cell.x + "px";
  div.style.top = cell.y + "px";
  div.setAttribute("data-index", index);
  div.setAttribute("data-letter", cell.letter);
  div.textContent = cell.letter;
  puzzleContainer.appendChild(div);
});

/* Harfleri (T, A, L, E) DOM’a ekle */
letters.forEach(letter => {
  const letterDiv = document.createElement("div");
  letterDiv.classList.add("letter");
  letterDiv.textContent = letter;
  letterDiv.setAttribute("data-letter", letter);
  letterContainer.appendChild(letterDiv);
});

/* -------------------------------------------
   3) Harf Seçimi ve Çizgi Çizme
------------------------------------------- */
let isMouseDown = false;
let selectedLetters = [];
let selectedLetterDivs = [];
const lines = [];

function selectLetter(target) {
  if (!target || !target.classList.contains("letter")) return;
  if (!selectedLetterDivs.includes(target)) {
    selectedLetterDivs.push(target);
    selectedLetters.push(target.getAttribute("data-letter"));
    target.classList.add("selected");

    if (selectedLetterDivs.length > 1) {
      drawLine(selectedLetterDivs[selectedLetterDivs.length - 2], target);
    }
  }
}

function drawLine(startDiv, endDiv) {
  const startX = startDiv.offsetLeft + startDiv.offsetWidth / 2;
  const startY = startDiv.offsetTop + startDiv.offsetHeight / 2;
  const endX = endDiv.offsetLeft + endDiv.offsetWidth / 2;
  const endY = endDiv.offsetTop + endDiv.offsetHeight / 2;

  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  const line = document.createElement("div");
  line.classList.add("line");
  line.style.width = `${distance}px`;
  line.style.left = `${startX}px`;
  line.style.top = `${startY}px`;
  line.style.transform = `rotate(${angle}deg)`;
  lineContainer.appendChild(line);
  lines.push(line);
}

function resetSelection() {
  selectedLetters = [];
  selectedLetterDivs.forEach(div => div.classList.remove("selected"));
  selectedLetterDivs = [];
  lines.forEach(line => line.remove());
  lines.length = 0;
}

function revealWord(wordObj) {
  wordObj.cellIndexes.forEach(index => {
    const cell = document.querySelector(`.cell[data-index='${index}']`);
    if (cell) {
      cell.classList.remove("hidden");
      cell.classList.add("visible");
    }
  });
  checkIfGameCompleted(); // Her kelime tamamlandığında oyunun bitip bitmediğini kontrol et

}
function checkIfGameCompleted() {
  const allRevealed = document.querySelectorAll(".cell.visible").length === puzzleCells.length;
  if (allRevealed) {
    setTimeout(showWinScreen, 500); 
  }
}
document.getElementById("close-btn").addEventListener("click", function () {
  document.getElementById("win-screen").style.display = "none";
});
function showWinScreen() {
  document.getElementById("win-screen").style.display = "flex";
}

/* -------------------------------------------
   4) Olaylar: Mouse ve Touch
------------------------------------------- */
/* Mouse Olayları */
letterContainer.addEventListener("mousedown", e => {
  isMouseDown = true;
  selectLetter(e.target);
});
letterContainer.addEventListener("mousemove", e => {
  if (isMouseDown) selectLetter(e.target);
});
document.addEventListener("mouseup", () => {
  if (isMouseDown) {
    isMouseDown = false;
    const formedWord = selectedLetters.join("");
    console.log("Seçilen Kelime:", formedWord);
    const foundWordObj = puzzleWords.find(obj => obj.word === formedWord);
    if (foundWordObj) {
      revealWord(foundWordObj);
    }
    resetSelection();
  }
});

/* Dokunmatik (Touch) Olayları - Mobil cihazlar için */
letterContainer.addEventListener("touchstart", e => {
  e.preventDefault();
  isMouseDown = true;
  const touch = e.touches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  selectLetter(target);
});
letterContainer.addEventListener("touchmove", e => {
  e.preventDefault();
  if (isMouseDown) {
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    selectLetter(target);
  }
});
document.addEventListener("touchend", () => {
  if (isMouseDown) {
    isMouseDown = false;
    const formedWord = selectedLetters.join("");
    console.log("Seçilen Kelime:", formedWord);
    const foundWordObj = puzzleWords.find(obj => obj.word === formedWord);
    if (foundWordObj) {
      revealWord(foundWordObj);
    }
    resetSelection();
  }
});
document.addEventListener("touchcancel", () => {
  if (isMouseDown) {
    isMouseDown = false;
    resetSelection();
  }
});

/* -------------------------------------------
   5) Responsive Ölçeklendirme (JS)
------------------------------------------- */
function updateResponsiveLayout() {
  // Scrollbar gizleme
  document.documentElement.style.overflow = "hidden";

  // Ekran boyutlarını al
  const availWidth  = window.innerWidth;
  const availHeight = window.innerHeight;

  // Referans değerler (tasarım temel ölçüleri)
  const refPuzzleWidth  = 400;
  const refPuzzleHeight = 300;
  const refLetterSize   = 300;
  const refH1Height     = 50;
  const refMargin       = 20;

  // Ek multiplier'lar
  const puzzleMultiplier = 1.2;
  const letterMultiplier = 0.8;

  // Toplam referans yükseklik
  const totalRefHeight = refH1Height + (refPuzzleHeight * puzzleMultiplier) + refMargin + (refLetterSize * letterMultiplier);

  // Global ölçek hesapla
  const globalScale = Math.min(availHeight / totalRefHeight, availWidth / (refPuzzleWidth * puzzleMultiplier));
  const puzzleScale = globalScale * puzzleMultiplier;
  const letterScale = globalScale * letterMultiplier;

  // Yeni puzzle container boyutları
  const newPuzzleWidth = refPuzzleWidth * puzzleScale;
  const newPuzzleHeight = refPuzzleHeight * puzzleScale;
  puzzleContainer.style.width  = (newPuzzleWidth - 20) + "px";
  puzzleContainer.style.height = newPuzzleHeight + "px";
  puzzleContainer.style.overflow = "hidden";

  // Puzzle hücrelerinin grup bounding box'unu hesapla
  const cellWidth = 50;
  const cellHeight = 50;
  const xs = puzzleCells.map(cell => cell.x);
  const ys = puzzleCells.map(cell => cell.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs) + cellWidth;
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys) + cellHeight;
  const groupWidth  = maxX - minX;
  const groupHeight = maxY - minY;

  // Scaled group ölçüleri ve ofset 
  const scaledGroupWidth = groupWidth * puzzleScale;
  const scaledGroupHeight = groupHeight * puzzleScale;
  const offsetX = (newPuzzleWidth - scaledGroupWidth) / 2 - (minX * puzzleScale);
  const offsetY = (newPuzzleHeight - scaledGroupHeight) / 2 - (minY * puzzleScale);

  // Puzzle hücrelerinin konum ve boyutlarını güncelle
  puzzleCells.forEach((cell, index) => {
    const div = puzzleContainer.querySelector(`.cell[data-index='${index}']`);
    if (div) {
      div.style.left = (cell.x * puzzleScale + offsetX)-17 + "px";
      div.style.top  = (cell.y * puzzleScale + offsetY) + "px";
      const newSize = cellWidth * puzzleScale;
      div.style.width  = newSize + "px";
      div.style.height = newSize + "px";
      div.style.fontSize = (18 * puzzleScale) + "px";
    }
  });

  // Harf çemberinin boyutunu ayarla
  const newLetterSize = refLetterSize * letterScale;
  letterContainer.style.width  = newLetterSize + "px";
  letterContainer.style.height = newLetterSize + "px";

  // Puzzle container ile harf çemberi arasındaki margin
  const margin = refMargin * puzzleScale;

  // Toplam içerik yüksekliğini hesapla (başlık hariç: puzzle + margin + letter container)
  const totalContentHeight = newPuzzleHeight + margin + newLetterSize;
  const verticalOffset = (availHeight - totalContentHeight) / 2;

  // Puzzle container'ı dikey olarak konumlandır
  puzzleContainer.style.position = "absolute";
  puzzleContainer.style.top = verticalOffset + "px";

  // Harf çemberini puzzle'ın altına, ortalanmış şekilde yerleştir
  const puzzleRect = puzzleContainer.getBoundingClientRect();
  letterContainer.style.position = "absolute";
  letterContainer.style.left = (puzzleRect.left + (puzzleRect.width - newLetterSize) / 2) + "px";
  letterContainer.style.top  = (verticalOffset + newPuzzleHeight + margin) + "px";

  // Harf çemberi içindeki harflerin konum ve boyutlarını ölçekle
  const refCenterX = newLetterSize / 2;
  const refCenterY = newLetterSize / 2;
  const refRadius = newLetterSize / 3;
  letters.forEach((letter, i) => {
    const letterDiv = letterContainer.querySelector(`.letter[data-letter='${letter}']`);
    if (letterDiv) {
      const angle = i * ((2 * Math.PI) / letters.length) - Math.PI / 2;
      const letterOffset = (40 * letterScale) / 2;
      const posX = refCenterX + refRadius * Math.cos(angle) - letterOffset;
      const posY = refCenterY + refRadius * Math.sin(angle) - letterOffset;
      letterDiv.style.left = posX + "px";
      letterDiv.style.top  = posY + "px";
      const size = 40 * letterScale;
      letterDiv.style.width  = size + "px";
      letterDiv.style.height = size + "px";
      letterDiv.style.fontSize = (16 * letterScale) + "px";
    }
  });
}

/* -------------------------------------------
   6) Sayfa Yüklendiğinde ve Yeniden Boyutlandığında
------------------------------------------- */
window.addEventListener("load", updateResponsiveLayout);
window.addEventListener("resize", updateResponsiveLayout);
document.getElementById("start-btn").addEventListener("click", function () {
  document.getElementById("start-screen").style.display = "none";
  initGame();
});