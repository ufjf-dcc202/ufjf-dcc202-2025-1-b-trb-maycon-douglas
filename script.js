console.log("✅ O script.js está conectado corretamente ao index.html!");

// Aguarda que todo o conteúdo da página seja carregado
document.addEventListener("DOMContentLoaded", () => {
  // Seleciona a div do canteiro pelo seu ID
  const gameGrid = document.getElementById("game-grid");
  const gridSize = 12 * 12; // Total de células na grade (144)
  let gridState = [];
  const toolbar = document.getElementById("toolbar");
  const selectedToolUI = document.getElementById("selected-tool");
  let currentAction = "enxada"; // Ação inicial
  const nextDayBtn = document.getElementById("next-day-btn");
  let playerMoney = 100; // Dinheiro inicial
  const maxGrowthStage = 3; // O estágio em que a planta está pronta para colher

  const plantValues = {
    cenoura: 25,
    tomate: 50,
    milho: 75,
  };

  const seedCosts = {
    cenoura: 5,
    tomate: 10,
    milho: 15,
  };

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
      let images = [];
      let className = `grid-cell ${cellState.type}`;

      if (cellState.type === "plantado") {
        let plantImage;
        if (cellState.stage === 0) {
          plantImage = `url('assets/semente_${cellState.seed}.png')`;
        } else {
          plantImage = `url('assets/${cellState.seed}_etapa_${cellState.stage}.png')`;
        }
        images.push(plantImage);
        if (cellState.watered) {
          images.push(`url('assets/solo_molhado.png')`);
        }
        images.push(`url('assets/arado.png')`);
        className += ` seed-${cellState.seed}`;
      }
      // Condição para planta morta
      else if (cellState.type === "planta_morta") {
        const deadPlantImage = `url('assets/planta_morta.png')`;
        const soilImage = `url('assets/arado.png')`;

        // Empilha a imagem da planta morta sobre o solo arado
        images.push(deadPlantImage, soilImage);
      } else {
        // Lógica para todos os outros tipos simples (grama, pedra, etc.)
        images.push(`url('assets/${cellState.type}.png')`);
      }

      cell.style.backgroundImage = images.join(", ");
      cell.className = className;
    });
  }

  const moneyValueUI = document.getElementById("money-value");

  function updateMoneyUI() {
    moneyValueUI.textContent = playerMoney;
  }

  gameGrid.addEventListener("click", (event) => {
    if (!event.target.classList.contains("grid-cell")) return; // Sai se não for uma célula

    const index = parseInt(event.target.dataset.index);
    const cellState = gridState[index];

    // Se a célula contém uma planta no estágio máximo de crescimento
    if (cellState.type === "plantado" && cellState.stage >= maxGrowthStage) {
      // 1. Ganhar dinheiro
      const value = plantValues[cellState.seed];
      playerMoney += value;
      updateMoneyUI();
      console.log(
        `Colheu ${cellState.seed} por ${value}! Total: ${playerMoney}`
      );

      // 2. Resetar a célula para terra arada
      gridState[index] = { type: "arado" };

      // 3. Re-renderizar e parar a execução para não fazer mais nada neste clique
      renderGrid();
      return;
    }

    // Lógica para usar a ENXADA
    if (currentAction === "enxada" && cellState.type === "grama") {
      gridState[index] = { type: "arado" }; // Muda o estado para 'arado'
    }
    // Lógica para PLANTAR (verifica se a ação é uma das sementes)
    else if (
      ["cenoura", "tomate", "milho"].includes(currentAction) &&
      cellState.type === "arado"
    ) {
      const cost = seedCosts[currentAction];

      // Verifica se o jogador tem dinheiro
      if (playerMoney >= cost) {
        // 1. Deduzir o custo
        playerMoney -= cost;
        updateMoneyUI();

        // 2. Plantar a semente (lógica que já tínhamos)
        gridState[index] = {
          type: "plantado",
          seed: currentAction,
          stage: 0,
          watered: false,
        };
        console.log(
          `Plantou ${currentAction} por ${cost}. Restam ${playerMoney}`
        );
      } else {
        // Se não tiver dinheiro, avisa o jogador
        alert("Dinheiro insuficiente para comprar esta semente!");
      }
    }
    // Lógica para REGAR
    else if (
      currentAction === "regador" &&
      cellState.type === "plantado" &&
      !cellState.watered
    ) {
      gridState[index].watered = true; // Marca como regada
    } else if (
      currentAction === "regador" &&
      cellState.type === "plantado" &&
      !cellState.watered
    ) {
      gridState[index].watered = true;
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

  function updateSelectedToolUI() {
    const img = selectedToolUI.querySelector("img");
    const p = selectedToolUI.querySelector("p");

    if (currentAction === "enxada") {
      img.src = "assets/enxada.png";
      p.textContent = "Enxada";
    } else if (currentAction === "regador") {
      img.src = "assets/regador.png";
      p.textContent = "Regador";
    } else {
      img.src = `assets/pacote_${currentAction}.png`;
      p.textContent = `Semente de ${currentAction}`;
    }
  }

  function passDay() {
    gridState.forEach((cellState, index) => {
      // A lógica só se aplica a células com plantas
      if (cellState.type === "plantado") {
        // Se a planta foi regada, ela cresce
        if (cellState.watered) {
          const maxGrowthStage = 3;
          if (cellState.stage < maxGrowthStage) {
            gridState[index].stage++; // Avança o estágio
          }
          gridState[index].watered = false; // A terra seca, precisa regar de novo amanhã
        }
        // Se não foi regada, ela morre
        else {
          gridState[index] = { type: "planta_morta" };
        }
      }
    });

    // Após processar todas as células, atualizamos a tela
    renderGrid();
    console.log("Um novo dia começou!");
  }

  // Inicializa o jogo
  initializeGridState();
  createGridCells(); // Cria as células da grade
  renderGrid(); // Pinta as células com as imagens corretas
  nextDayBtn.addEventListener("click", passDay);
  updateMoneyUI(); // Define o valor inicial na tela
});
