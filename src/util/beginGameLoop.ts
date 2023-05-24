import { Cell } from "../types/Cell";
import { Lion, Zebra, Animal } from "../types/Animals";
import { Water } from "../types/Water";
import { renderBoard } from "./renderBoard";
import { cloneDeep } from "lodash";
import { AnimalDesires } from "../constants/AnimalDesiresEnum";
import { moveAnimalTowardDesire } from "../util/moveAnimalTowardDesire";

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
  try {
    for (const row of boardState) {
      for (const cell of row) {
        // Really means contains something other than dirt, since dirt will always be the first item in contents[]
        const cellContainsSomething = cell.contents.length > 1;

        if (cellContainsSomething) {
          for (const element of updatedBoardState[cell.x][cell.y].contents) {
            // Process animal desires and interactions
            if (element instanceof Animal) {
              if (element.deceased === true) {
                continue;
              }

              element.increaseDesires();
              const desire = element.getGreatestDesire();
              console.log(`${element.type}'s current desire: ${desire}`);

              switch (desire) {
                case AnimalDesires.Food:
                  moveAnimalTowardDesire({
                    animalCell: cell,
                    updatedBoardState,
                    getDesire: (desiredElement) => {
                      if (element.type === "zebra") {
                        return desiredElement.type === "grass";
                      }
                      if (element.type === "lion") {
                        return (
                          desiredElement instanceof Zebra &&
                          desiredElement.deceased === false
                        );
                      }
                    },
                    desireFn: (desiredElement) => {
                      if (element.type === "lion") {
                        const cellContentsToUpdate =
                          updatedBoardState[desiredElement.x][desiredElement.y]
                            .contents;
                        const zebra = cellContentsToUpdate[
                          cellContentsToUpdate.length - 1
                        ] as Zebra;
                        zebra.setDeceased();
                      }
                      element.eat();
                    },
                  });
                  break;

                case AnimalDesires.Water:
                  moveAnimalTowardDesire({
                    animalCell: cell,
                    updatedBoardState,
                    getDesire: (e) => e instanceof Water,
                    desireFn: () => element.drink(),
                  });
                  break;

                case AnimalDesires.Reproduce:
                  moveAnimalTowardDesire({
                    animalCell: cell,
                    updatedBoardState,
                    getDesire: (desiredElement) => {
                      if (element.type === "zebra") {
                        return (
                          desiredElement instanceof Zebra &&
                          desiredElement.deceased === false &&
                          desiredElement.id !== element.id
                        );
                      }
                      if (element.type === "lion") {
                        return (
                          desiredElement instanceof Lion &&
                          desiredElement.deceased === false &&
                          desiredElement.id !== element.id
                        );
                      }
                    },
                    desireFn: (desiredElement) => {
                      // This pattern is very naive because it expects the last item in the Cell contents
                      // array to be the animal. This could crash the application if something else is the last
                      // item in the array.
                      const animal = desiredElement.contents[
                        desiredElement.contents.length - 1
                      ] as Lion | Zebra;
                      if (
                        animal.deceased === false &&
                        animal.getGreatestDesire() === AnimalDesires.Reproduce
                      ) {
                        const adjacentCells = cell
                          .getNearestCellIndexes()
                          .filter(([x, y]) => {
                            // TODO refactor repeated logic to keep code DRY
                            return (
                              x >= 0 &&
                              x < boardState.length &&
                              y >= 0 &&
                              y < boardState[0].length &&
                              !boardState[x][y].contents.some(
                                (e) => e.isObstacle
                              )
                            );
                          });

                        if (adjacentCells.length) {
                          const baby = element.reproduce();
                          const [babyX, babyY] = adjacentCells[0];
                          updatedBoardState[babyX][babyY].contents.push(baby);
                        }
                      }
                    },
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
  } catch (e) {
    console.error("ERROR IN GAME LOOP: ", e);
    alert(e);
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

  const gameInterval = setInterval(() => gameLoop(board), 5000);

  // ---------------------- CREATE GAME CONTROLS ----------------------
  window.addEventListener("keyup", (event) => {
    if (event.key === "Escape") {
      clearInterval(gameInterval);
    }
  });
}
