import { Lion, Zebra } from "./Animals";
import { Grass, Tree } from "./Plants";
import { Water } from "./Water";
import { Dirt } from "./Dirt";

interface ICellConstructor {
  x: Cell["x"];
  y: Cell["y"];
  contents: Cell["contents"];
}

export class Cell {
  contents: Array<Lion | Zebra | Grass | Tree | Water | Dirt>;
  x: number;
  y: number;

  constructor({ x, y, contents }: ICellConstructor) {
    this.contents = contents;
    this.x = x;
    this.y = y;
  }

  getNearestCellIndexes() {
    return [
      [this.x - 1, this.y],
      [this.x + 1, this.y],
      [this.x, this.y - 1],
      [this.x, this.y + 1],
      [this.x - 1, this.y - 1],
      [this.x + 1, this.y + 1],
      [this.x + 1, this.y - 1],
      [this.x - 1, this.y + 1],
    ];
  }
}
