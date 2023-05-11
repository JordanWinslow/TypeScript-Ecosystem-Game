import { Cell } from "../classes";

// function created by chatgpt and updated with a criteria function and types
export function findNearestCell(
  x: number,
  y: number,
  array: Cell[][],
  criteria: (cell: Cell) => boolean
): Cell | null {
  let minDistance = Number.MAX_VALUE;
  let nearestCell: Cell | null = null;

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      const cell = array[i][j];
      // ensure cell meets criteria before calculating distance (ex: cell contains water)
      if (cell && criteria(cell)) {
        // calculate Euclidean distance
        const distance = Math.sqrt((i - x) ** 2 + (j - y) ** 2);
        if (distance < minDistance) {
          minDistance = distance;
          nearestCell = cell;
        }
      }
    }
  }
  return nearestCell;
}
