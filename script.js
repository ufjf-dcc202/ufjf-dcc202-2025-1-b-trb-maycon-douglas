// === CONSTANTES DO JOGO === \\
const GRID_SIZE = 12 * 12;
const MAX_GROWTH_STAGE = 3; // número máximo de estágio do crescimento de uma planta

// Constantes para as imagens de fundo
const deadPlantImage = `url('assets/planta_morta.png')`;
const soilImage = `url('assets/arado.png')`;

// Define valores de venda das plantas
const PLANT_VALUES = {
  cenoura: 25,
  tomate: 50,
  milho: 75,
};

// Define os custos das sementes
const SEED_COSTS = {
  cenoura: 5,
  tomate: 10,
  milho: 15,
};

// === ESTADOS DO JOGO  === \\
let gridState = []; // Canteiro do jogo, onde cada célula tem um estado
let playerMoney = 100; // Dinheiro do jogador, inicialmente 100
let currentAction = "enxada"; // Ferramenta ou ação atual

// === REFERÊNCIAS DO DOM  === \\
let gameGrid, toolbar, selectedToolUI, nextDayBtn, moneyValueUI;

// === FUNÇÕES DO JOGO  === \\

// Popula o canteiro inicial com grama, pedras e ervas daninhas aleatoriamente
function initializeGridState() {
  gridState = []; // Limpa o estado anterior se houver
  for (let i = 0; i < GRID_SIZE; i++) {
    const randomNumber = Math.random(); // Gera um número entre 0 e 1
    let cellType = "grama"; // O padrão é ser grama

    if (randomNumber < 0.1) cellType = "pedra"; // 10% de chance de ser pedra
    else if (randomNumber < 0.25) cellType = "erva-daninha"; // 15% de chance de ser erva daninha
    gridState.push({ type: cellType });
  }
}

// Cria as células da grade (canteiros individuais)
function createGridCells() {
  gameGrid.innerHTML = ""; // Limpa a grade para garantir que não haja duplicatas
  for (let i = 0; i < GRID_SIZE; i++) {
    // Cria um novo elemento div para ser uma célula da grade
    const cell = document.createElement("div");
    // Adiciona uma classe a essa div para que seja estilizada com CSS
    cell.classList.add("grid-cell");
    // Define 'data-index' para saber qual célula é qual ao clicar
    cell.dataset.index = i;
    // Adiciona a célula recém-criada dentro do game-grid
    gameGrid.appendChild(cell);
  }
}

// Atualiza o "visual" do canteiro com base no estado atual
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

// Atualiza a exibição do dinheiro do jogador
function updateMoneyUI() {
  moneyValueUI.textContent = playerMoney;
}

// Atualiza a exibição da ferramenta selecionada
function updateSelectedToolUI() {
  const img = selectedToolUI.querySelector("img");
  const p = selectedToolUI.querySelector("p");

  // Define a imagem e o texto corretos para a ação atual
  if (currentAction === "enxada") {
    img.src = "assets/enxada.png";
    p.textContent = "Enxada";
  } else if (currentAction === "regador") {
    img.src = "assets/regador.png";
    p.textContent = "Regador";
  } else {
    // Para todas as sementes
    img.src = `assets/pacote_${currentAction}.png`;
    p.textContent = `Semente de ${currentAction}`;
  }
}

// Avança o jogo para o próximo dia
function passDay() {
  gridState.forEach((cellState, index) => {
    // A lógica só se aplica a células com plantas
    if (cellState.type === "plantado") {
      // Se a planta foi regada, ela cresce
      if (cellState.watered) {
        const MAX_GROWTH_STAGE = 3;
        if (cellState.stage < MAX_GROWTH_STAGE) {
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

  // Atualiza a tela após passar o dia
  renderGrid();
}

// === MANIPULADORES DE EVENTO  === \\

// Lida com cliques no canteiro do jogo (Colher, arar, plantar, regar...)
function handlerGridClick(event) {
  if (!event.target.classList.contains("grid-cell")) return;

  const index = parseInt(event.target.dataset.index);
  const cellState = gridState[index];

  // Lógica de Colheita
  if (cellState.type === "plantado" && cellState.stage >= MAX_GROWTH_STAGE) {
    const value = PLANT_VALUES[cellState.seed];
    playerMoney += value;
    updateMoneyUI();
    gridState[index] = { type: "arado" };
    renderGrid();
    return;
  }

  // todas as ações de preparação do solo acontecem com a enxada
  if (currentAction === "enxada") {
    // Se for grama, ara a terra
    if (cellState.type === "grama") {
      gridState[index] = { type: "arado" };
    }
    // Se for pedra ou erva daninha, limpa o terreno
    else if (cellState.type === "pedra" || cellState.type === "erva-daninha") {
      gridState[index] = { type: "grama" };
    }
    // Se for uma planta morta, também limpa, transformando em terra arada
    else if (cellState.type === "planta_morta") {
      gridState[index] = { type: "arado" };
    }
  }
  // Lógica para PLANTAR (só funciona se a ação atual for uma semente)
  else if (
    ["cenoura", "tomate", "milho"].includes(currentAction) &&
    cellState.type === "arado"
  ) {
    const cost = SEED_COSTS[currentAction];
    if (playerMoney >= cost) {
      playerMoney -= cost;
      updateMoneyUI();
      gridState[index] = {
        type: "plantado",
        seed: currentAction,
        stage: 0,
        watered: false,
      };
    } else {
      alert("Dinheiro insuficiente para comprar esta semente!");
    }
  }
  // Lógica para REGAR (só funciona se a ação atual for o regador)
  else if (
    currentAction === "regador" &&
    cellState.type === "plantado" &&
    !cellState.watered
  ) {
    gridState[index].watered = true;
  }

  renderGrid();
}

// Lida com cliques na barra de ferramentas para selecionar uma ação
function handleToolbarClick(event) {
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
}

// === INICIALIZAÇÃO DO JOGO  === \\

function init() {
  gameGrid = document.getElementById("game-grid"); // Seleciona a div do canteiro pelo seu ID
  toolbar = document.getElementById("toolbar"); // Seleciona a barra de ferramentas pelo seu ID
  selectedToolUI = document.getElementById("selected-tool"); // Selectiona a área que mostra a ferramenta selecionada
  nextDayBtn = document.getElementById("next-day-btn"); // Seleciona o botão de PRÓXIMO DIA
  moneyValueUI = document.getElementById("money-value"); // Seleciona o elemento que mostra o dinheiro do jogador

  initializeGridState(); // Inicializa o estado do jogo
  createGridCells(); // Cria as células da grade
  renderGrid(); // Renderiza a grade com as imagens corretas
  updateMoneyUI(); // Atualiza a exibição do dinheiro do jogador

  gameGrid.addEventListener("click", handlerGridClick); // Adiciona o manipulador de eventos para cliques no canteiro
  toolbar.addEventListener("click", handleToolbarClick); // Adiciona o manipulador de eventos para cliques na barra de ferramentas
  nextDayBtn.addEventListener("click", passDay); // Adiciona o manipulador de eventos para o botão de próximo dia
}

// Aguarda que todo o conteúdo da página seja carregado e inicia o jogo
document.addEventListener("DOMContentLoaded", init);
