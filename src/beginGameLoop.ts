import { Cell, Animal, Water, Zebra, Lion } from "./classes";
import { findNearestCell } from "./util/findNearestCell";
import { renderBoard } from "./renderBoard";
import { cloneDeep } from "lodash";
import chance from "chance";

// Could be simplified by only passing in the absolute necessary params instead of the entire board state and cell instance
interface IMoveAnimalTowardDesireParams {
  // Cell instance containing animal
  animalCell: Cell;
  // current board state determining animal's position
  boardState: Cell[][];
  // copy of board state we should update when animal moves
  updatedBoardState: Cell[][];
  // Desire to move animal towards
  getDesireByClassInstance: (e: Cell["contents"][number]) => boolean;
}

export function moveAnimalTowardDesire({
  animalCell,
  boardState,
  updatedBoardState,
  getDesireByClassInstance,
}: IMoveAnimalTowardDesireParams) {
  const nearestDesire = findNearestCell(
    animalCell.x,
    animalCell.y,
    boardState,
    (c) => c.contents.some(getDesireByClassInstance)
  );

  const alreadyNextToDesire =
    nearestDesire &&
    (Math.abs(nearestDesire.x - animalCell.x) === 1 ||
      nearestDesire.x === animalCell.x) &&
    (Math.abs(nearestDesire.y - animalCell.y) === 1 ||
      nearestDesire.y === animalCell.y);

  if (alreadyNextToDesire) {
    return;
  }

  const [newXValue, newYValue] = [
    animalCell.x + Math.sign(nearestDesire!.x - animalCell.x),
    animalCell.y + Math.sign(nearestDesire!.y - animalCell.y),
  ];

  const adjacentCells = animalCell.getNearestCellIndexes().filter(([x, y]) => {
    return (
      x >= 0 &&
      x < boardState.length &&
      y >= 0 &&
      y < boardState[0].length &&
      !boardState[x][y].contents.some((e) => e.isObstacle)
    );
  });

  const optimalPath = [
    [newXValue, newYValue],
    [newXValue, animalCell.y],
    [animalCell.x, newYValue],
  ].filter(([x, y]) => {
    return (
      x >= 0 &&
      x < boardState.length &&
      y >= 0 &&
      y < boardState[0].length &&
      boardState[x][y].contents.some((e) => e.isObstacle)
    );
  });

  const [moveToX, moveToY] =
    optimalPath.length > 0
      ? optimalPath[0]
      : adjacentCells.length > 0
      ? chance().pickone(adjacentCells)
      : [animalCell.x, animalCell.y];

  const targetCell = updatedBoardState[moveToX][moveToY];

  if (!targetCell.contents.some((e) => e.isObstacle)) {
    const movingAnimal =
      updatedBoardState[animalCell.x][animalCell.y].contents.pop();
    targetCell.contents.push(movingAnimal!);
  }
}

interface IBeginGameLoopParams {
  initialBoardState: Cell[][];
  board: HTMLDivElement;
}

let boardState: Cell[][];
let updatedBoardState: Cell[][];

function gameLoop(board: HTMLDivElement) {
  console.log("ROUND BEGINNING");
  // Create copy of board state to perform all updates on during iteration so we don't mutate the original while looping.
  // We need a robust function for this since it involves copying a class instance inside of a 2 dimensional array.
  // We could also accomplish this with far less memory needed if we add properties like "hasMoved" or "hasActivated"
  // To the animal class, but this will make the code more complicated so as long as it performs well, this should suffice.
  updatedBoardState = cloneDeep(boardState);
  console.log("UPDATED BOARD STATE: ", updatedBoardState);
  for (const row of boardState) {
    for (const cell of row) {
      // Really means contains something other than dirt, since dirt will always be the first item in contents[]
      const cellContainsSomething = cell.contents.length > 1;

      if (cellContainsSomething) {
        for (const element of updatedBoardState[cell.x][cell.y].contents) {
          // Process animal desires and interactions
          if (element instanceof Animal) {
            if (element.deceased === true) {
              break;
            }
            element.increaseDesires();
            const desire = element.getGreatestDesire();
            console.log(`${element.type}'s current desire: ${desire}`);

            switch (desire) {
              case "looking for food":
                const nearestDesire = findNearestCell(
                  cell.x,
                  cell.y,
                  boardState,
                  (c) => c.contents.some((e) => e.type === "grass")
                );

                const alreadyNextToDesire =
                  nearestDesire &&
                  (Math.abs(nearestDesire.x - cell.x) === 1 ||
                    nearestDesire.x === cell.x) &&
                  (Math.abs(nearestDesire.y - cell.y) === 1 ||
                    nearestDesire.y === cell.y);

                if (alreadyNextToDesire) {
                  element.eat();
                  break;
                }

                const [newXValue, newYValue] = [
                  cell.x + Math.sign(nearestDesire!.x - cell.x),
                  cell.y + Math.sign(nearestDesire!.y - cell.y),
                ];

                const optimalPath = [
                  [newXValue, newYValue],
                  [newXValue, cell.y],
                  [cell.x, newYValue],
                ].filter(([x, y]) => {
                  return (
                    x >= 0 &&
                    x < boardState.length &&
                    y >= 0 &&
                    y < boardState[0].length &&
                    !boardState[x][y].contents.some((e) => e.isObstacle)
                  );
                });

                const [moveToX, moveToY] =
                  optimalPath.length > 0 ? optimalPath[0] : [cell.x, cell.y];

                const targetCell = updatedBoardState[moveToX][moveToY];

                if (
                  !targetCell.contents.some((e) => e.isObstacle) &&
                  !targetCell.contents.some((e) => e instanceof Animal)
                ) {
                  const movingAnimal =
                    updatedBoardState[cell.x][cell.y].contents.pop();
                  targetCell.contents.push(movingAnimal!);
                }
                break;

              case "looking for water":
                const nearestDesire = findNearestCell(
                  cell.x,
                  cell.y,
                  boardState,
                  (c) => c.contents.some((e) => e instanceof Water)
                );

                const alreadyNextToDesire =
                  nearestDesire &&
                  (Math.abs(nearestDesire.x - cell.x) === 1 ||
                    nearestDesire.x === cell.x) &&
                  (Math.abs(nearestDesire.y - cell.y) === 1 ||
                    nearestDesire.y === cell.y);

                if (alreadyNextToDesire) {
                  element.drink();
                  break;
                }

                const [newXValue, newYValue] = [
                  cell.x + Math.sign(nearestDesire!.x - cell.x),
                  cell.y + Math.sign(nearestDesire!.y - cell.y),
                ];

                const optimalPath = [
                  [newXValue, newYValue],
                  [newXValue, cell.y],
                  [cell.x, newYValue],
                ].filter(([x, y]) => {
                  return (
                    x >= 0 &&
                    x < boardState.length &&
                    y >= 0 &&
                    y < boardState[0].length &&
                    !boardState[x][y].contents.some((e) => e.isObstacle)
                  );
                });

                const [moveToX, moveToY] =
                  optimalPath.length > 0 ? optimalPath[0] : [cell.x, cell.y];

                const targetCell = updatedBoardState[moveToX][moveToY];

                if (
                  !targetCell.contents.some((e) => e.isObstacle) &&
                  !targetCell.contents.some((e) => e instanceof Animal)
                ) {
                  const movingAnimal =
                    updatedBoardState[cell.x][cell.y].contents.pop();
                  targetCell.contents.push(movingAnimal!);
                }
                break;
              case "looking for mate":
                moveAnimalTowardDesire({
                  animalCell: cell,
                  boardState,
                  updatedBoardState, // TODO account for lions mating with lions
                  getDesireByClassInstance: (e) => e instanceof Zebra,
                });
                break;
            }

            if (element.hungerLevel === 10 || element.thirstLevel === 10) {
              element.loseHealth(1);
            }
          }
        }
      }
    }
  }
  boardState = updatedBoardState;
  // Now that we have updated the board state we need to re-render it!
  renderBoard({ boardState, board });
}

export function beginGameLoop({
  initialBoardState,
  board,
}: IBeginGameLoopParams) {
  // INITIALIZE BOARD AND RENDER FIRST ITERATION
  boardState = initialBoardState;
  renderBoard({ boardState, board });

  const gameInterval = setInterval(() => gameLoop(board), 3000);

  // ---------------------- CREATE GAME CONTROLS ----------------------
  window.addEventListener("keyup", (event) => {
    if (event.key === "Escape") {
      clearInterval(gameInterval);
    }
  });
}
