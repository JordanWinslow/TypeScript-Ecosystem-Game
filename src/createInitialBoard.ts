import { Animal, Cell, Dirt, Plant, Water } from "./classes";

interface ICreateInitialBoardParams {
  board: HTMLElement;
  boardSize?: number;
  lionCount?: number;
  zebraCount?: number;
  grassCount?: number;
  treeCount?: number;
  resourceDensity?: "low" | "medium" | "high";
}

// Initialize the board with empty cells
export function createInitialBoard({
  board,
  boardSize = 20,
  resourceDensity,
  grassCount,
  treeCount,
  zebraCount,
  lionCount
}: ICreateInitialBoardParams) {
  // Create a 2D array of cells that represents the board
  const boardState: Cell[][] = [];

  // Loop over each row in the board
  for (let rowNumber = 0; rowNumber < boardSize; rowNumber++) {
    const newRow: Cell[] = [];
    // Loop over each column in the row and initialize each cell to just contain dirt
    for (let columnNumber = 0; columnNumber < boardSize; columnNumber++) {
      const ground = new Dirt();
      const contents = [ground];

      const cell = new Cell({ x: rowNumber, y: columnNumber, contents });

      newRow.push(cell);
    }
    boardState.push(newRow);
  }

  // Now that every cell contains dirt, randomly insert plants and animals

  return boardState;
}
