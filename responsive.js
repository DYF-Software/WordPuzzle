document.addEventListener("DOMContentLoaded", function () {
    function adjustGameLayout() {
        const gameContainer = document.getElementById("game-container");
        const puzzle = document.getElementById("puzzle");
        const letterContainer = document.getElementById("letter-container");
        
        if (!gameContainer || !puzzle || !letterContainer) {
            console.error("Bazı HTML öğeleri bulunamadı! Lütfen 'game-container', 'puzzle' ve 'letter-container' ID'lerinin HTML'de tanımlı olduğundan emin olun.");
            return;
        }
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        if (width < 768) {
            gameContainer.style.flexDirection = "column";
            puzzle.style.width = `${width * 0.95}px`;
            puzzle.style.height = `${height * 0.55}px`;
            puzzle.style.margin = "auto";
            letterContainer.style.width = `${width * 0.8}px`;
            letterContainer.style.height = `${width * 0.8}px`;
            letterContainer.style.marginTop = "auto";
            letterContainer.style.marginBottom = "30px";
            gameContainer.style.justifyContent = "center";
        } else {
            gameContainer.style.flexDirection = "column";
            puzzle.style.width = `${width * 0.7}px`;
            puzzle.style.height = `${height * 0.6}px`;
            puzzle.style.margin = "auto";
            letterContainer.style.width = `${width * 0.45}px`;
            letterContainer.style.height = `${width * 0.45}px`;
            letterContainer.style.marginTop = "auto";
            letterContainer.style.marginBottom = "50px";
            gameContainer.style.justifyContent = "center";
        }
    }

    window.addEventListener("resize", adjustGameLayout);
    adjustGameLayout();
});