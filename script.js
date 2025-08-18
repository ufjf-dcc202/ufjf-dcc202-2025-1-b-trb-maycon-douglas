// script.js
console.log("✅ O script.js está conectado corretamente ao index.html!");

// Aguarda que todo o conteúdo da página seja carregado
document.addEventListener("DOMContentLoaded", () => {
  // Selecionamos o nosso a div do canteiro pelo seu ID
  const gameGrid = document.getElementById("game-grid");
  const gridSize = 12 * 12; // Total de células na grade (144)
  let gridState = [];
  const toolbar = document.getElementById("toolbar");
  const selectedToolUI = document.getElementById("selected-tool");
  let currentAction = "enxada"; // Ação inicial

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

  function renderGrid() {
    const cells = document.querySelectorAll(".grid-cell");
    cells.forEach((cell, index) => {
      const cellState = gridState[index];
      let image = "";
      let className = `grid-cell ${cellState.type}`;

      // Limpa estilos antigos para evitar acúmulo
      cell.style.backgroundColor = "";

      if (cellState.type === "plantado") {
        const seedImage = `url('assets/semente_${cellState.seed}.png')`;
        const soilImage = `url('assets/arado.png')`;

        // A primeira imagem na lista fica por CIMA. A segunda fica por BAIXO.
        cell.style.backgroundImage = `${seedImage}, ${soilImage}`;

        className += ` seed-${cellState.seed}`;
      } else {
        // Para todos os outros casos, apenas uma imagem é usada
        image = `url('assets/${cellState.type}.png')`;
        cell.style.backgroundImage = image;
      }

      cell.className = className;
    });
  }

  gameGrid.addEventListener("click", (event) => {
    if (!event.target.classList.contains("grid-cell")) return; // Sai se não for uma célula

    const index = parseInt(event.target.dataset.index);
    const cellState = gridState[index];

    // Lógica para usar a ENXADA
    if (currentAction === "enxada" && cellState.type === "grama") {
      gridState[index] = { type: "arado" }; // Muda o estado para 'arado'
    }
    // Lógica para PLANTAR (verifica se a ação é uma das sementes)
    else if (
      ["cenoura", "tomate", "milho"].includes(currentAction) &&
      cellState.type === "arado"
    ) {
      gridState[index] = {
        type: "plantado",
        seed: currentAction,
        stage: 0, // Estágio inicial de crescimento
        watered: false, // Ainda não foi regada
      };
    }
    // Lógica para LIMPAR
    else if (cellState.type === "pedra" || cellState.type === "erva-daninha") {
      gridState[index] = { type: "grama" };
    }

    renderGrid();
  });

  toolbar.addEventListener("click", (event) => {
    // Encontra o botão que foi clicado, mesmo que o clique tenha sido na imagem dentro dele
    const button = event.target.closest(".tool-button");

    if (button) {
      // Pega a ação do atributo 'data-action' que definimos no HTML
      const action = button.dataset.action;
      currentAction = action;

      // Atualiza a UI para mostrar a seleção
      updateSelectedToolUI();

      // Atualiza o visual dos botões
      document.querySelectorAll(".tool-button").forEach((btn) => {
        btn.classList.remove("selected");
      });
      button.classList.add("selected");
    }
  });

  function updateSelectedToolUI() {
    const img = selectedToolUI.querySelector("img");
    const p = selectedToolUI.querySelector("p");

    // Define a imagem e o texto corretos para a ação atual
    if (currentAction === "enxada") {
      img.src = "assets/enxada.png";
      p.textContent = "Enxada";
    } else {
      // Para todas as sementes
      img.src = `assets/pacote_${currentAction}.png`;
      p.textContent = `Semente de ${currentAction}`;
    }
  }

  // Inicializa o jogo
  initializeGridState();
  createGridCells(); // Cria as células da grade
  renderGrid(); // Pinta as células com as imagens corretas
});
