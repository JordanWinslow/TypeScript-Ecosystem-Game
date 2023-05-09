import { Cell } from "./classes";

interface IRenderBoardParams {
  board: HTMLDivElement;
  boardState: Cell[][];
}

export function renderBoard({ board, boardState }: IRenderBoardParams) {
  console.log("Rendering Board State: ", boardState);
  // Clear the board so we don't end up creating new boards every iteration
  // NAIVE and SLOW approach since we tear down every div and rebuild from scratch
  board.innerHTML = null;
  // Loop through every row
  boardState.forEach((row) => {
    // Create an HTML Div element to hold each cell in an individual row
    const gridRow = document.createElement("div");
    gridRow.className = "row";
    board.appendChild(gridRow);

    // Loop through every cell in the current row
    row.forEach((cell) => {
      // Create an HTML Div element reprensenting each cell and it's contents
      const gridCell = document.createElement("div");
      gridCell.classList.add("cell");

      cell.contents.forEach((content) => {
        switch (content.type) {
          case "grass":
            gridCell.innerHTML = "🌱";
            break;
          case "tree":
            gridCell.innerHTML = "🌳";
            break;
          case "water":
            gridCell.classList.add("water");
            break;
          case "lion":
            gridCell.innerHTML = "🦁";
            break;
          case "zebra":
            gridCell.innerHTML = "🦓";
            break;
          // Dirt is the default
          default:
            gridCell.classList.add("dirt");
        }
      });
      gridRow.appendChild(gridCell);
    });
  });
}
