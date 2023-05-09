import { Animal, Cell, Dirt, Plant, Water } from "./classes";

interface IPopulateBoardParams {
  boardState: Cell[][];
  boardSize: number;
  elementCount: number;
  elementType: "tree" | "grass" | "water" | "lion" | "zebra";
}

function populateBoard({ boardState, boardSize }: IPopulateBoardParams) {
  for (
    let elementsCreated = 0;
    elementsCreated < elementCount;
    elementsCreated++
  ) {
    const randomCellX = chance.integer({ min: 0, max: boardSize });
    const randomCellY = chance.integer({ min: 0, max: boardSize });
    if (boardState[randomCellX][randomCellY].contents.length === 1) {
      boardState[randomCellX][randomCellY].contents.push(new Animal("lion"));
    }
  }
}

interface ICreateInitialBoardParams {
  board: HTMLElement;
  boardSize?: number;
  lionCount?: number;
  zebraCount?: number;
  treeCount?: number;
  resourceDensity?: "low" | "medium" | "high";
}

// Initialize the board with empty cells
export function createInitialBoard({
  board,
  boardSize = 20,
  resourceDensity = "low",
  treeCount = 1,
  zebraCount = 1,
  lionCount = 1,
}: ICreateInitialBoardParams) {
  // Throw error if user tries to create too many elements.
  if (treeCount + zebraCount + lionCount > boardSize * boardSize) {
    throw new RangeError(
      "Number of animals and plants exceeds bopard size! Please increase board size or lower number of animals and plants."
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
  // Now that every cell contains dirt, randomly insert plants and animals
  

  // TODO make this a generic function usable for any type
  for (let lionsCreated = 0; lionsCreated < lionCount; lionsCreated++) {
    const randomCellX = chance.integer({ min: 0, max: boardSize });
    const randomCellY = chance.integer({ min: 0, max: boardSize });
    if (boardState[randomCellX][randomCellY].contents.length === 1) {
      boardState[randomCellX][randomCellY].contents.push(new Animal("lion"));
    }
  }

  return boardState;
}
