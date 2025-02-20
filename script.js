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
    { word: "TEAL", cellIndexes: [0,1,2,3] },
    { word: "TALE", cellIndexes: [0,4,5,6] },
    { word: "LATE", cellIndexes: [7,8,9,10] },
    { word: "ALE", cellIndexes: [11,12,13] }
];


  // Doğru kelime kontrolü için kelime listesi
  const words = puzzleWords.map(w => w.word);
  
  /*****************************************************
   * 3) Puzzle Hücrelerini Ekrana Ekleyelim (DOM)
   *****************************************************/
  const puzzleContainer = document.getElementById("puzzle");
  
  puzzleCells.forEach((cell, index) => {
    const div = document.createElement("div");
    div.classList.add("cell", "hidden"); // Başlangıçta gizli
    div.style.left = cell.x + "px";
    div.style.top = cell.y + "px";
    
    // Hücreye index ve harf bilgisini ekleyelim
    div.setAttribute("data-index", index);
    div.setAttribute("data-letter", cell.letter);
    
    div.textContent = cell.letter;
    puzzleContainer.appendChild(div);
  });
  
  /*****************************************************
   * 4) Harf Çemberi (Alttaki Seçim Alanı)
   *
   * Çemberde B, U, L, A, Ş, I, K harfleri yer alacak
   *****************************************************/
  const letters = ["T", "A", "L", "E"];
  const letterContainer = document.getElementById("letter-container");
  
  const centerX = 150;
  const centerY = 150;
  const radius = 100;
  const angleStep = (2 * Math.PI) / letters.length;
  
  letters.forEach((letter, i) => {
    const angle = i * angleStep - Math.PI / 2; // Açı hesaplama (Dikey hizalama için -90 derece)
    const x = centerX + radius * Math.cos(angle) - 20; // Harfi merkezleyerek hizala
    const y = centerY + radius * Math.sin(angle) - 20; // Harfi merkezleyerek hizala
    
    const letterDiv = document.createElement("div");
    letterDiv.classList.add("letter");
    letterDiv.textContent = letter;
    letterDiv.setAttribute("data-letter", letter);
    letterDiv.style.left = `${x}px`;
    letterDiv.style.top = `${y}px`;
    letterContainer.appendChild(letterDiv);
});
  
  /*****************************************************
   * 5) Fare ile Harf Seçimi Mantığı
   *****************************************************/
  let isMouseDown = false;
  let selectedLetters = [];
  let selectedLetterDivs = [];
  
  // Fare basılıyken
  letterContainer.addEventListener("mousedown", e => {
    isMouseDown = true;
    selectLetter(e.target);
  });
  
  // Fare sürüklenirken
  letterContainer.addEventListener("mousemove", e => {
    if (isMouseDown) {
      selectLetter(e.target);
    }
  });
  
  // Fare bırakınca
  document.addEventListener("mouseup", () => {
    if (isMouseDown) {
      isMouseDown = false;
      const formedWord = selectedLetters.join("");
      console.log("Seçilen Kelime:", formedWord);
      
      // Doğru kelime mi?
      const foundWordObj = puzzleWords.find(obj => obj.word === formedWord);
      if (foundWordObj) {
        revealWord(foundWordObj);
      }
      
      resetSelection();
    }
  });

  
  
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

  const lineContainer = document.getElementById("line-container");
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

    // Çizgileri temizle
    lines.forEach(line => line.remove());
    lines.length = 0;
}
  
  /*****************************************************
   * 6) Doğru Kelime Bulunduğunda Hücreleri Açalım
   *****************************************************/
  function revealWord(wordObj) {
    wordObj.cellIndexes.forEach(index => {
      const cell = document.querySelector(`.cell[data-index='${index}']`);
      if (cell) {
        cell.classList.remove("hidden");
        cell.classList.add("visible");
      }
    });
  }
  