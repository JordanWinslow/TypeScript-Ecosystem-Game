import { createInitialBoard } from "./createInitialBoard";
import { renderBoard } from "./renderBoard";
import "./styles.css";

// The board is the actual HTML we want to render. Not to be mistaken for the board state which is Cell[][]
const board = document.getElementById("board") as HTMLDivElement;

try {
  // The board state is the JavaScript object representing each cell and it's contents.
  const initialBoardState = createInitialBoard({
    board,
    boardSize: 10,
  });
  // The render method takes the board state and renders it to the board HTML
  renderBoard({ boardState: initialBoardState, board });
} catch (error) {
  alert(error);
}

// setInterval(
//   () =>
//     renderBoard({
//       board,
//       boardState: createInitialBoard({ board, boardSize: 10 })
//     }),
//   3000
// );
