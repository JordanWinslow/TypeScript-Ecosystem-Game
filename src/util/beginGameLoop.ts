import { cloneDeep } from "lodash";
import { Animal } from "../types/Animals";
import { Cell } from "../types/Cell";
import { processAnimalDesires } from "./processAnimalDesires";
import { renderBoard } from "./renderBoard";

// How many milliseconds should pass before rendering a new game round
let GAME_SPEED = 3000;
// setInterval returns a number associated with the active interval.
let gameInterval: number;
// If user has changed game speed (or other options affecting rendering) this will be true
let shouldUpdateInterval = false;
// Whether or not game is paused
let isPaused = false;
// Current state of board before processing the new round.
let boardState: Cell[][];
// The new round is created here then replaces the boardState.
let updatedBoardState: Cell[][];

function gameLoop(board: HTMLDivElement) {
  if (isPaused) {
    // do nothing if game paused
    return;
  }

  if (shouldUpdateInterval) {
    shouldUpdateInterval = false;
    clearInterval(gameInterval);
    gameInterval = setInterval(() => gameLoop(board), GAME_SPEED);
    // exit the current round before processing since a new interval will begin
    return;
  }
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

              processAnimalDesires({
                desire,
                animalCell: cell,
                animal: element,
                updatedBoardState,
              });

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

interface IBeginGameLoopParams {
  initialBoardState: Cell[][];
  board: HTMLDivElement;
}

export function beginGameLoop({
  initialBoardState,
  board,
}: IBeginGameLoopParams) {
  // INITIALIZE BOARD AND RENDER FIRST ITERATION
  boardState = initialBoardState;
  renderBoard({ boardState, board });

  gameInterval = setInterval(() => gameLoop(board), GAME_SPEED);

  // ---------------------- CREATE GAME CONTROLS ----------------------
  window.addEventListener("keyup", (event) => {
    console.log(event.key);
    if (event.key === "Escape") {
      // refresh the page to reset game
      location.reload();
    }
    // Spacebar
    if (event.key === " ") {
      if (isPaused) {
        isPaused = false;
      } else {
        isPaused = true;
      }
    }
    if (event.key === "ArrowDown") {
      GAME_SPEED = GAME_SPEED + 1000;
      shouldUpdateInterval = true;
    }
    if (event.key === "ArrowUp") {
      if (GAME_SPEED === 1000) {
        // don't let user make game faster than 1 render per second
        return;
      } else {
        GAME_SPEED = GAME_SPEED - 1000;
        shouldUpdateInterval = true;
      }
    }
  });
}
