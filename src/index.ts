import "./styles.css";
import { createInitialBoard } from "./util/createInitialBoard";
import { renderBoard } from "./util/renderBoard";

// We'll use this later to create some controls
const boardContainer = document.getElementById(
  "boardContainer"
) as HTMLDivElement;
// The board is the actual HTML we want to render. Not to be mistaken for the board state which is Cell[][]
const board = document.getElementById("board") as HTMLDivElement;
try {
  // The board state is the JavaScript object representing each cell and it's contents.
  const initialBoardState = createInitialBoard({
    boardSize: 10,
    lionCount: 2,
    zebraCount: 6,
    treeCount: 10,
    resourceDensity: "high",
  });

  renderBoard({ boardState: initialBoardState, board });
} catch (error) {
  alert(error);
}
