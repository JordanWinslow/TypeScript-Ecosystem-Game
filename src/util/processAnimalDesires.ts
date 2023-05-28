import { Cell } from "../types/Cell";
import { Lion, Zebra, Animal } from "../types/Animals";
import { Water } from "../types/Water";
import { AnimalDesires } from "../constants/AnimalDesiresEnum";
import { moveAnimalTowardDesire } from "../util/moveAnimalTowardDesire";

interface IProcessAnimalDesiresParams {
  desire: AnimalDesiresEnum;
  animalCell: Cell;
  animal: Animal;
  updatedBoardState: Cell[][];
}

export function processAnimalDesires({
  desire,
  animalCell,
  animal,
  updatedBoardState,
}: IProcessAnimalDesiresParams) {
  switch (desire) {
    case AnimalDesires.Food:
      moveAnimalTowardDesire({
        animalCell,
        updatedBoardState,
        getDesire: (desiredElement) => {
          if (animal.type === "zebra") {
            return desiredElement.type === "grass";
          }
          if (animal.type === "lion") {
            return (
              desiredElement instanceof Zebra &&
              desiredElement.deceased === false
            );
          }
        },
        desireFn: (desiredElement) => {
          if (animal.type === "lion") {
            const cellContentsToUpdate =
              updatedBoardState[desiredElement.x][desiredElement.y].contents;
            const zebra = cellContentsToUpdate[
              cellContentsToUpdate.length - 1
            ] as Zebra;
            zebra.setDeceased();
          }
          animal.eat();
        },
      });
      break;

    case AnimalDesires.Water:
      moveAnimalTowardDesire({
        animalCell,
        updatedBoardState,
        getDesire: (e) => e instanceof Water,
        desireFn: () => animal.drink(),
      });
      break;

    case AnimalDesires.Reproduce:
      moveAnimalTowardDesire({
        animalCell,
        updatedBoardState,
        getDesire: (desiredElement) => {
          if (animal.type === "zebra") {
            return (
              desiredElement instanceof Zebra &&
              desiredElement.deceased === false &&
              desiredElement.id !== animal.id
            );
          }
          if (animal.type === "lion") {
            return (
              desiredElement instanceof Lion &&
              desiredElement.deceased === false &&
              desiredElement.id !== animal.id
            );
          }
        },
        desireFn: (desiredElement) => {
          // This pattern is very naive because it expects the last item in the Cell contents
          // array to be the animal. This could crash the application if something else is the last
          // item in the array.
          const animal = desiredElement.contents[
            desiredElement.contents.length - 1
          ] as Lion | Zebra;
          if (
            animal.deceased === false &&
            animal.getGreatestDesire() === AnimalDesires.Reproduce
          ) {
            const adjacentCells = animalCell
              .getNearestCellIndexes()
              .filter(([x, y]) => {
                // TODO refactor repeated logic to keep code DRY
                return (
                  x >= 0 &&
                  x < updatedBoardState.length &&
                  y >= 0 &&
                  y < updatedBoardState[0].length &&
                  !updatedBoardState[x][y].contents.some((e) => e.isObstacle)
                );
              });

            if (adjacentCells.length) {
              const baby = animal.reproduce();
              const [babyX, babyY] = adjacentCells[0];
              updatedBoardState[babyX][babyY].contents.push(baby);
            }
          }
        },
      });
      break;
  }
}
