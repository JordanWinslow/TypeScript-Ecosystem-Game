import { Lion, Zebra } from "./Animals";
import { Dirt } from "./Dirt";
import { Grass, Tree } from "./Plants";
import { Water } from "./Water";

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
    // TODO
  }
}
