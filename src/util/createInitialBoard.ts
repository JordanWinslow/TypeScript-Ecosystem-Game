import { Cell } from "../types/Cell";
import { Dirt } from "../types/Dirt";
interface ICreateInitialBoardParams {
  boardSize?: number;
  lionCount?: number;
  zebraCount?: number;
  treeCount?: number;
  resourceDensity?: "low" | "medium" | "high";
}

// Initialize the board with dirt, then populate it with plants, animals and water
export function createInitialBoard({
  boardSize = 20,
  resourceDensity = "medium",
  treeCount = 5,
  zebraCount = 4,
  lionCount = 2,
}: ICreateInitialBoardParams) {
  // Throw error if user tries to create too many elements.
  if (treeCount + zebraCount + lionCount > boardSize * boardSize) {
    throw new RangeError(
      "Number of animals and plants exceeds board size! Please increase board size or lower number of animals and plants."
    );
  }
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

  return boardState;
}
