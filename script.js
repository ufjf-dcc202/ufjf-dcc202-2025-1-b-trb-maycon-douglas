// script.js
console.log("✅ O script.js está conectado corretamente ao index.html!");

// Aguarda que todo o conteúdo da página seja carregado
document.addEventListener("DOMContentLoaded", () => {
  // Selecionamos o nosso a div do canteiro pelo seu ID
  const gameGrid = document.getElementById("game-grid");
  const gridSize = 12 * 12; // Total de células na grade (144)

  // Função para criar o canteiro inicial
  function createInitialGrid() {
    for (let i = 0; i < gridSize; i++) {
      // 1. Cria um novo elemento div para ser uma célula da grade
      const cell = document.createElement("div");

      // 2. Adicionar uma classe a essa div para que possamos estilizá-la com CSS
      cell.classList.add("grid-cell");

      // Adiciona um ID para cada célula
      cell.id = `cell-${i}`;

      // 3. Adiciona a célula recém-criada dentro do game-grid
      gameGrid.appendChild(cell);
    }
  }

  // Executa a função para criar o canteiro inicial
  createInitialGrid();
});
