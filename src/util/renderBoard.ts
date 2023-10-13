import { Cell } from "../types/Cell";
import { Dirt } from "../types/Dirt";

interface IRenderBoardParams {
  board: HTMLDivElement;
  boardState: Cell[][];
}

export function renderBoard({ board, boardState }: IRenderBoardParams) {
  console.log("Rendering Board State: ", boardState);
  const updatedBoard = document.createElement("div");

  // Loop through every row
  boardState.forEach((row) => {
    // Create an HTML Div element to hold each cell in an individual row
    const gridRow = document.createElement("div");
    gridRow.className = "row";
    updatedBoard.appendChild(gridRow);

    // Loop through every cell in the current row
    row.forEach((cell) => {
      // Create an HTML Div element reprensenting each cell and it's contents
      const gridCell = document.createElement("div");
      gridCell.classList.add("cell");

      cell.contents.forEach((content) => {
        if (content instanceof Dirt) {
          // Dirt is the default and it uses CSS instead of an icon
          gridCell.classList.add("dirt");
          // uncomment this to test each cell appears where we expect!
          // gridCell.innerHTML = `X: ${cell.x} Y: ${cell.y}`;
        }
      });

      gridRow.appendChild(gridCell);
    });
  });

  board.innerHTML = updatedBoard.innerHTML;
}
