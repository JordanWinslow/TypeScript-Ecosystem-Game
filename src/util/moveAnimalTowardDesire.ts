import chance from "chance";
import { Cell } from "../types/Cell";
import { findNearestCell } from "./findNearestCell";

// Could be simplified by only passing in the absolute necessary params instead of the entire board state and cell instance
interface IMoveAnimalTowardDesireParams {
  // Cell instance containing animal
  animalCell: Cell;
  // copy of board state we should update when animal moves
  updatedBoardState: Cell[][];
  // function defining the desire criteria to move animal towards (ex: instanceof Animal && animal.deceased === false)
  getDesire: (e: Cell["contents"][number]) => boolean | void;
  // function to execute when animal comes into contact with desire (ex: animal.eat() animal.drink())
  desireFn: (nearestDesireCell: Cell) => void;
}

export function moveAnimalTowardDesire({
  animalCell,
  updatedBoardState,
  getDesire,
  desireFn,
}: IMoveAnimalTowardDesireParams) {
  const nearestDesire = findNearestCell(
    animalCell.x,
    animalCell.y,
    updatedBoardState,
    (c) => c.contents.some(getDesire)
  );

  if (!nearestDesire) {
    return;
  }

  const alreadyNextToDesire =
    nearestDesire &&
    (Math.abs(nearestDesire.x - animalCell.x) === 1 ||
      nearestDesire.x === animalCell.x) &&
    (Math.abs(nearestDesire.y - animalCell.y) === 1 ||
      nearestDesire.y === animalCell.y);

  if (alreadyNextToDesire) {
    desireFn(nearestDesire);
    return;
  }

  const [newXValue, newYValue] = [
    animalCell.x + Math.sign(nearestDesire!.x - animalCell.x),
    animalCell.y + Math.sign(nearestDesire!.y - animalCell.y),
  ];

  const filterOutOfRangeValues = ([x, y]: number[]) => {
    return (
      x >= 0 &&
      x < updatedBoardState.length &&
      y >= 0 &&
      y < updatedBoardState[0].length &&
      !updatedBoardState[x][y].contents.some((e) => e.isObstacle)
    );
  };

  const adjacentCells = animalCell
    .getNearestCellIndexes()
    .filter(filterOutOfRangeValues);

  const optimalPath = [
    [newXValue, newYValue],
    [newXValue, animalCell.y],
    [animalCell.x, newYValue],
  ].filter(filterOutOfRangeValues);

  const [moveToX, moveToY] =
    optimalPath.length > 0
      ? optimalPath[0]
      : adjacentCells.length > 0
      ? chance().pickone(adjacentCells)
      : [animalCell.x, animalCell.y];

  const targetCell = updatedBoardState[moveToX][moveToY];

  if (!targetCell.contents.some((e) => e.isObstacle)) {
    const movingAnimal =
      updatedBoardState[animalCell.x][animalCell.y].contents.pop();
    targetCell.contents.push(movingAnimal!);
  }
}
