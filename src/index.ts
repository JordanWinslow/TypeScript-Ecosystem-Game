import { createInitialBoard } from "./createInitialBoard";
import { beginGameLoop } from "./beginGameLoop";
import "./styles.css";

// The board is the actual HTML we want to render. Not to be mistaken for the board state which is Cell[][]
const board = document.getElementById("board") as HTMLDivElement;

try {
  // The board state is the JavaScript object representing each cell and it's contents.
  const initialBoardState = createInitialBoard({
    boardSize: 15,
    lionCount: 3,
    zebraCount: 5,
    resourceDensity: "low",
  });
  beginGameLoop({ initialBoardState, board });
} catch (error) {
  alert(error);
}
