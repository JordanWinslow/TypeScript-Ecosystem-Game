import { Lion, Zebra } from "../types/Animals";
import { Grass, Tree } from "../types/Plants";
import { Water } from "../types/Water";
import { Dirt } from "../types/Dirt";
import { Cell } from "../types/Cell";
import chance from "chance";

interface IPopulateBoardParams {
  boardState: Cell[][];
  boardSize: number;
  elementCount: number;
  elementType: "tree" | "grass" | "water" | "lion" | "zebra";
}

function populateBoard({
  boardState,
  boardSize,
  elementCount,
  elementType,
}: IPopulateBoardParams) {
  console.log("Populating board with " + elementCount + " " + elementType);
  for (
    let elementsCreated = 0;
    elementsCreated < elementCount;
    elementsCreated++
  ) {
    const randomCellX = chance().integer({ min: 0, max: boardSize - 1 });
    const randomCellY = chance().integer({ min: 0, max: boardSize - 1 });
    const randomCellContents = boardState[randomCellX][randomCellY].contents;
    const cellContainsOnlyDirt =
      randomCellContents.length === 1 && randomCellContents[0] instanceof Dirt;

    if (cellContainsOnlyDirt) {
      switch (elementType) {
        case "lion":
          randomCellContents.push(new Lion());
          break;
        case "zebra":
          randomCellContents.push(new Zebra());
          break;
        case "tree":
          randomCellContents.push(new Tree());
          break;
        case "grass":
          randomCellContents.push(new Grass());
          break;
        case "water":
          // first remove the dirt to replace it with water
          randomCellContents.pop();
          randomCellContents.push(new Water());
      }
    } else {
      // random cell already had something so choose new cell recursively with 1 count until we succeed.
      populateBoard({ boardState, boardSize, elementCount: 1, elementType });
    }
  }
}

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
  // Now that every cell contains dirt, randomly insert plants, animals and water
  const grassAndWaterCount =
    resourceDensity === "high"
      ? Math.round(boardSize / 2)
      : resourceDensity === "medium"
      ? Math.round(boardSize / 4)
      : Math.round(boardSize / 6);
  const elementsToCreate = [
    { type: "tree" as const, count: treeCount },
    { type: "zebra" as const, count: zebraCount },
    { type: "lion" as const, count: lionCount },
    { type: "grass" as const, count: grassAndWaterCount },
    { type: "water" as const, count: grassAndWaterCount },
  ];

  elementsToCreate.forEach((element) => {
    populateBoard({
      boardState,
      boardSize,
      elementType: element.type,
      elementCount: element.count,
    });
  });

  return boardState;
}
