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

/* -------------------------------------------
   2) DOM Elemanlarını Oluşturma
------------------------------------------- */
const puzzleContainer = document.getElementById("puzzle");
const letterContainer  = document.getElementById("letter-container");
const lineContainer    = document.getElementById("line-container");
const letters = ["T", "A", "L", "E"];

/* Puzzle hücrelerini DOM’a ekle */
puzzleCells.forEach((cell, index) => {
  const div = document.createElement("div");
  div.classList.add("cell", "hidden"); // Başlangıçta gizli
  div.style.left = cell.x + "px";  // Referans konumlar (JS ölçekleyecek)
  div.style.top  = cell.y + "px";
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
  if (!target.classList.contains("letter")) return;
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
  const endX   = endDiv.offsetLeft + endDiv.offsetWidth / 2;
  const endY   = endDiv.offsetTop + endDiv.offsetHeight / 2;

  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  const line = document.createElement("div");
  line.classList.add("line");
  line.style.width = `${distance}px`;
  line.style.left  = `${startX}px`;
  line.style.top   = `${startY}px`;
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
}

/* Fare olayları */
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

/* -------------------------------------------
   4) Responsive Ölçeklendirme (JS)
------------------------------------------- */
function updateResponsiveLayout() {
  // Scrollbar gizleme
  document.documentElement.style.overflow = "hidden";

  // Ekran boyutlarını al
  const availWidth  = window.innerWidth;
  const availHeight = window.innerHeight;

  // Referans değerler (tasarımımızın temel ölçüleri)
  const refPuzzleWidth  = 400;  // Puzzle için referans genişlik
  const refPuzzleHeight = 300;  // Puzzle için referans yükseklik
  const refLetterSize   = 300;  // Harf çemberi için referans ölçü (width = height)
  const refH1Height     = 50;   // Başlık için yaklaşık referans yükseklik
  const refMargin       = 20;   // Puzzle ile harf çemberi arasındaki boşluk

  // Toplam referans yükseklik: Başlık + Puzzle + Margin + Harf Çemberi
  const totalRefHeight = refH1Height + refPuzzleHeight + refMargin + refLetterSize;

  // Global ölçek: Ekran yüksekliği veya genişliği referanslarına göre
  const globalScale = Math.min(1, availHeight / totalRefHeight, availWidth / refPuzzleWidth);

  // Puzzle container'ın mevcut ölçülerini al
  const puzzleRect   = puzzleContainer.getBoundingClientRect();
  const puzzleWidth  = puzzleRect.width;
  const puzzleHeight = puzzleRect.height;

  // Puzzle hücrelerinin ölçeklenmesi: Referans 400x300'e göre
  const scalePuzzle = Math.min(puzzleWidth / refPuzzleWidth, puzzleHeight / refPuzzleHeight);
  const scale = scalePuzzle * globalScale;

  // Puzzle hücrelerini güncelle
  puzzleCells.forEach((cell, index) => {
    const div = puzzleContainer.querySelector(`.cell[data-index='${index}']`);
    if (div) {
      div.style.left = (cell.x * scale) + "px";
      div.style.top  = (cell.y * scale) + "px";
      const newSize = 50 * scale; // Orijinal 50px
      div.style.width  = newSize + "px";
      div.style.height = newSize + "px";
      div.style.fontSize = (18 * scale) + "px";
    }
  });

  // Harf çemberinin boyutunu ve konumunu ayarla
  const letterBaseSize = refLetterSize; // 300px
  const letterSize = letterBaseSize * scale;
  letterContainer.style.width  = letterSize + "px";
  letterContainer.style.height = letterSize + "px";

  // Puzzle'ın altına, arada scaled margin olacak şekilde konumlandır
  const margin = refMargin * scale;
  letterContainer.style.position = "absolute";
  letterContainer.style.left = (puzzleRect.left + (puzzleWidth - letterSize) / 2) + "px";
  letterContainer.style.top  = (puzzleRect.bottom + margin) + "px";

  // Harf çemberi içindeki harfleri ölçekle (referans: merkez 150,150; yarıçap=100; harf boyutu 40, font=16px)
  const refCenterX = 150, refCenterY = 150, refRadius = 100;
  letters.forEach((letter, i) => {
    const letterDiv = letterContainer.querySelector(`.letter[data-letter='${letter}']`);
    if (letterDiv) {
      const angle = i * ((2 * Math.PI) / letters.length) - Math.PI / 2;
      // Harflerin orijinal pozisyonu (merkez + yarıçap)
      const posX = refCenterX + refRadius * Math.cos(angle) - 20;
      const posY = refCenterY + refRadius * Math.sin(angle) - 20;
      letterDiv.style.left = (posX * scale) + "px";
      letterDiv.style.top  = (posY * scale) + "px";
      const size = 40 * scale;
      letterDiv.style.width  = size + "px";
      letterDiv.style.height = size + "px";
      letterDiv.style.fontSize = (16 * scale) + "px";
    }
  });
}

/* -------------------------------------------
   5) Sayfa Yüklendiğinde ve Yeniden Boyutlandığında
------------------------------------------- */
window.addEventListener("load", updateResponsiveLayout);
window.addEventListener("resize", updateResponsiveLayout);
