// script.js
console.log("✅ O script.js está conectado corretamente ao index.html!");

// Aguarda que todo o conteúdo da página seja carregado
document.addEventListener("DOMContentLoaded", () => {
  // Selecionamos o nosso a div do canteiro pelo seu ID
  const gameGrid = document.getElementById("game-grid");
  const gridSize = 12 * 12; // Total de células na grade (144)
  let gridState = [];

  // Decide aleatoriamente o estado inicial de cada célula
  function initializeGridState() {
    gridState = []; // Limpa o estado anterior se houver
    for (let i = 0; i < gridSize; i++) {
      const randomNumber = Math.random(); // Gera um número entre 0 e 1
      let cellType = "grama"; // O padrão é ser grama

      if (randomNumber < 0.1) {
        // 10% de chance de ser pedra
        cellType = "pedra";
      } else if (randomNumber < 0.25) {
        // 15% de chance de ser erva daninha
        cellType = "erva-daninha";
      }

      gridState.push({ type: cellType });
    }
  }

  // Cria as células da grade (canteiros individuais)
  function createGridCells() {
    gameGrid.innerHTML = ""; // Limpa a grade para garantir que não haja duplicatas
    for (let i = 0; i < gridSize; i++) {
      // Cria um novo elemento div para ser uma célula da grade
      const cell = document.createElement("div");
      // Adiciona uma classe a essa div para que possamos estilizá-la com CSS
      cell.classList.add("grid-cell");
      // Define 'data-index' para saber qual célula é qual ao clicar
      cell.dataset.index = i;
      // Adiciona a célula recém-criada dentro do game-grid
      gameGrid.appendChild(cell);
    }
  }

  // Renderiza o estado atual da grade na tela
  function renderGrid() {
    const cells = document.querySelectorAll(".grid-cell");
    cells.forEach((cell, index) => {
      const cellState = gridState[index];
      // Define a imagem de fundo baseada no tipo da célula
      cell.style.backgroundImage = `url('assets/${cellState.type}.png')`;
      // Adiciona uma classe para estilização e identificação
      cell.className = `grid-cell ${cellState.type}`;
    });
  }

  // Evento de clique na grade que limpa o terreno
  gameGrid.addEventListener("click", (event) => {
    // Verifica se o que foi clicado foi realmente uma célula
    if (event.target.classList.contains("grid-cell")) {
      const index = event.target.dataset.index; // Pega o índice da célula clicada

      // Verifica o estado atual da célula no array de dados
      const cellState = gridState[index];

      // Se for uma pedra ou erva daninha, limpa a célula
      if (cellState.type === "pedra" || cellState.type === "erva-daninha") {
        gridState[index].type = "grama";
        renderGrid();
      }
    }
  });

  // Inicializa o jogo
  initializeGridState();
  createGridCells(); // Cria as células da grade
  renderGrid(); // Pinta as células com as imagens corretas
});
