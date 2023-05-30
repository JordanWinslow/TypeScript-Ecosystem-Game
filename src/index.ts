import "./styles.css";
import { beginGameLoop } from "./util/beginGameLoop";
import { convertToNumberOrUndefined } from "./util/convertToNumberOrUndefined";
import { createInitialBoard } from "./util/createInitialBoard";

// User controls where we let them set up initial board state and then pause / resume / end game
const initialSetupFormContainer = document.getElementById(
  "setupFormContainer"
) as HTMLDivElement;
const initialSetupForm = document.getElementById(
  "setupForm"
) as HTMLFormElement;

// The board is the actual HTML we want to render. Not to be mistaken for the board state which is Cell[][]
const board: HTMLDivElement = document.getElementById("board");

initialSetupForm.addEventListener("submit", (event) => {
  // Prevent browser from refreshing the page on submit.
  event.preventDefault();

  const formDataIterable = new FormData(initialSetupForm);
  // FormData will always be strings, so we will need to convert to a number before sending to createInitialBoard
  const { boardSize, lionCount, zebraCount, resourceDensity, treeCount } =
    Object.fromEntries(formDataIterable);

  try {
    // The board state is the JavaScript object representing each cell and it's contents.
    const initialBoardState = createInitialBoard({
      boardSize: convertToNumberOrUndefined(boardSize),
      lionCount: convertToNumberOrUndefined(lionCount),
      zebraCount: convertToNumberOrUndefined(zebraCount),
      treeCount: convertToNumberOrUndefined(treeCount),
      resourceDensity,
    });

    beginGameLoop({ initialBoardState, board });
    // hide setup form
    initialSetupFormContainer.classList.add("hidden");
  } catch (error) {
    alert(error);
  }
});
