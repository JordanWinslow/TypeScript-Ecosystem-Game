import { Cell, Animal, Plant, Water, Dirt } from "./classes";
import { findNearestCell } from "./util/findNearestCell";
import { renderBoard } from "./renderBoard";
import { cloneDeep } from "lodash";

interface IBeginGameLoopParams {
  initialBoardState: Cell[][];
  board: HTMLDivElement;
}

let boardState: Cell[][];
let updatedBoardState: Cell[][];

export function beginGameLoop({
  initialBoardState,
  board,
}: IBeginGameLoopParams) {
  // INITIALIZE BOARD AND RENDER FIRST ITERATION
  boardState = initialBoardState;
  renderBoard({ boardState, board });

  const gameLoop = setInterval(() => {
    console.log("ROUND BEGINNING");
    // Create copy of board state to perform all updates on during iteration so we don't mutate the original while looping
    updatedBoardState = cloneDeep(boardState);

    for (const row of boardState) {
      for (const cell of row) {
        // Really means contains something other than dirt, since dirt will always be the first item in contents[]
        const cellContainsSomething = cell.contents.length > 1;

        if (cellContainsSomething) {
          for (const element of cell.contents) {
            // Process animal desires and interactions
            if (element instanceof Animal) {
              element.increaseDesires();
              const desire = element.getGreatestDesire();
              console.log(`${element.type}'s greatest desire: ${desire}`);

              switch (desire) {
                case "looking for water":
                  const nearestWater = findNearestCell(
                    cell.x,
                    cell.y,
                    boardState,
                    (c) => c.contents.some((e) => e instanceof Water)
                  );

                  const alreadyNextToWater =
                    nearestWater &&
                    (Math.abs(nearestWater.x - cell.x) === 1 ||
                      nearestWater.x === cell.x) &&
                    (Math.abs(nearestWater.y - cell.y) === 1 ||
                      nearestWater.y === cell.y);

                  if (alreadyNextToWater) {
                    break;
                  }

                  const [newXValue, newYValue] = [
                    cell.x + Math.sign(nearestWater!.x - cell.x),
                    cell.y + Math.sign(nearestWater!.y - cell.y),
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
              }
            }
          }
        }
      }
    }
    boardState = updatedBoardState;
    // Now that we have updated the board state we need to re-render it!
    renderBoard({ boardState, board });
  }, 3000);

  // ---------------------- CREATE GAME CONTROLS ----------------------
  window.addEventListener("keyup", (event) => {
    if (event.key === "Escape") {
      clearInterval(gameLoop);
    }
  });
}
