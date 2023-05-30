import { Lion, Zebra } from "../types/Animals";
import { Cell } from "../types/Cell";
import { Dirt } from "../types/Dirt";
import { Grass, Tree } from "../types/Plants";
import { Water } from "../types/Water";

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
        if (content instanceof Lion || content instanceof Zebra) {
          const tooltipText = content.getTooltipText();
          gridCell.innerHTML = `<span class="tooltip" data-text="${tooltipText}">${content.icon}</span>`;
        } else if (content instanceof Grass || content instanceof Tree) {
          gridCell.innerHTML = content.icon;
        } else if (content instanceof Water) {
          // We use CSS to represent water, not an icon
          gridCell.classList.add("water");
        } else if (content instanceof Dirt) {
          // Dirt is the default and it uses CSS instead of an icon
          gridCell.classList.add("dirt");
        }
      });

      gridRow.appendChild(gridCell);
    });
  });
  board.innerHTML = updatedBoard.innerHTML;
}
