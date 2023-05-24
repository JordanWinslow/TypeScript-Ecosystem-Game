import { createInitialBoard } from "./util/createInitialBoard";
import { beginGameLoop } from "./util/beginGameLoop";
import "./styles.css";

// User controls where we let them set up initial board state and then pause / resume / end game
const initialSetupFormContainer = document.getElementById(
  "setupFormContainer"
) as HTMLDivElement;
const initialSetupForm = document.getElementById(
  "setupForm"
) as HTMLFormElement;

// The board is the actual HTML we want to render. Not to be mistaken for the board state which is Cell[][]
const board = document.getElementById("board") as HTMLDivElement;

initialSetupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formDataIterable = new FormData(initialSetupForm);
  const { boardSize, lionCount, zebraCount, resourceDensity, treeCount } =
    Object.fromEntries(formDataIterable);

  try {
    // The board state is the JavaScript object representing each cell and it's contents.
    const initialBoardState = createInitialBoard({
      boardSize: +boardSize,
      lionCount: +lionCount,
      zebraCount: +zebraCount,
      treeCount: +treeCount,
      resourceDensity,
    });
    beginGameLoop({ initialBoardState, board });
    // hide setup form
    initialSetupFormContainer.classList.add("hidden");
  } catch (error) {
    alert(error);
  }
});
