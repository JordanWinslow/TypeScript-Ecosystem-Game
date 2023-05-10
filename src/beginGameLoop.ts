import { Cell, Animal, Plant, Water, Dirt } from "./classes";
import { renderBoard } from "./renderBoard";

// function created by chatgpt and updated with a criteria function
function findNearestCell(x, y, array, criteria) {
  let minDistance = Number.MAX_VALUE;
  let nearestElement = null;

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j] && criteria(array[i][j])) {
        // only check for elements matching criteria such as "call contains water"
        const distance = Math.sqrt((i - x) ** 2 + (j - y) ** 2); // calculate Euclidean distance
        if (distance < minDistance) {
          minDistance = distance;
          nearestElement = array[i][j];
        }
      }
    }
  }

  return nearestElement;
}

interface IBeginGameLoopParams {
  initialBoardState: Cell[][];
  board: HTMLDivElement;
}

export function beginGameLoop({
  initialBoardState,
  board,
}: IBeginGameLoopParams) {
  const boardState = initialBoardState;
  renderBoard({ boardState, board });
  // -----------------------------------------------------
  const gameLoop = setInterval(() => {
    console.log("ROUND BEGINNING");

    boardState.forEach((row) => {
      row.forEach((cell) => {
        const cellContainsSomething = cell.contents.length > 1;

        if (cellContainsSomething) {
          cell.contents.forEach((element) => {
            if (element instanceof Animal) {
              console.log("Calculating " + element.type + " Desires");
              // increase hunger, thirst and reproductive urge
              element.increaseDesires();
              // get animals greatest desire to determine what they should move towards
              const desire = element.getGreatestDesire();
              console.log(element.type + "'s greatest desire: " + desire);
              switch (desire) {
                case "looking for water":
                  const nearestDesire = findNearestCell(
                    cell.x,
                    cell.y,
                    boardState,
                    (cell) => {
                      return cell.contents.some(
                        (element) => element instanceof Water
                      );
                    }
                  );
                  // Check if animal is already next to their greatest desire
                  if (
                    (Math.abs(nearestDesire.x - cell.x) === 1 ||
                      nearestDesire.x === cell.x) &&
                    (Math.abs(nearestDesire.y - cell.y) === 1 ||
                      nearestDesire.y === cell.y)
                  ) {
                    break;
                  }

                  let newXValue =
                    cell.x > nearestDesire.x
                      ? cell.x - 1
                      : cell.x < nearestDesire.x
                      ? cell.x + 1
                      : cell.x;
                  let newYValue =
                    cell.y > nearestDesire.y
                      ? cell.y - 1
                      : cell.y < nearestDesire.y
                      ? cell.y + 1
                      : cell.y;

                  let availableCell = null;
                  // Look for a non-obstacle cell that is adjacent to the current position of the moving animal
                  const adjacentCells = [
                    [cell.x - 1, cell.y],
                    [cell.x + 1, cell.y],
                    [cell.x, cell.y - 1],
                    [cell.x, cell.y + 1],
                    [cell.x + 1, cell.y + 1],
                    [cell.x - 1, cell.y - 1],
                    [cell.x + 1, cell.y - 1],
                    [cell.x - 1, cell.y + 1],
                  ];
                  for (const [x, y] of adjacentCells) {
                    if (
                      x >= 0 &&
                      x < boardState.length &&
                      y >= 0 &&
                      y < boardState[0].length &&
                      !boardState[x][y].contents.some(
                        (element) => element.isObstacle
                      )
                    ) {
                      availableCell = boardState[x][y];
                      break;
                    }
                  }
                  // If no obstacle, move along the optimal path towards nearestDesire
                  if (
                    !boardState[newXValue][newYValue].contents.some(
                      (element) => element.isObstacle
                    )
                  ) {
                    const movingAnimal =
                      boardState[cell.x][cell.y].contents.pop();
                    boardState[newXValue][newYValue].contents.push(
                      movingAnimal!
                    );
                    // if obstacle, choose the first available cell with no obstacle
                  } else if (availableCell) {
                    const movingAnimal =
                      boardState[cell.x][cell.y].contents.pop();
                    availableCell.contents.push(movingAnimal!);
                  } else {
                    // if no open spaces and no optimal path available, don't do anything.
                  }
                  break;
              }
            }
          });
        }
      });
    });
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
