export class Cell {
  contents: Array<Animal | Plant | Water | Dirt>;
  isObstacle: boolean;
  x: number;
  y: number;

  constructor({ x, y, contents }) {
    this.contents = contents;
    this.isObstacle = contents.some((content) => content.isObstacle);
    this.x = x;
    this.y = y;
  }

  updateContents(contents: Cell["contents"]) {
    this.contents = contents;
  }
}

export class Animal {
  type: "zebra" | "lion";
  age: "newborn" | "child" | "adult" | "senior";
  hungerLevel: number;
  thirstLevel: number;
  reproductiveUrge: number;
  speed: number;
  health: number;
  // All animals are obstacles
  isObstacle: true;

  constructor(type: Animal["type"]) {
    this.type = type;
    this.speed = 1;
    this.age = "adult";
    this.health = 100;
    this.thirstLevel = 0;
    this.hungerLevel = 0;
    this.reproductiveUrge = 0;
    this.isObstacle = true;
  }
}

export class Plant {
  type: "tree" | "grass";
  nutritionalValue: number;
  // trees are obstacles, grass is not
  isObstacle: boolean;

  constructor(type: Plant["type"]) {
    this.type = type;
    this.nutritionalValue = 50;
    this.isObstacle = type === "tree";
  }
}

export class Dirt {
  type = "dirt";
  isObstacle = false;
  // Whether or not the dirt should spawn a plant next iteration
  willBecomePlant: boolean;

  constructor() {
    this.willBecomePlant = false;
  }

  turnIntoPlant() {
    this.willBecomePlant = true;
  }
}

export class Water {
  type = "water";
  amount = Infinity;
  isObstacle = true;
}
