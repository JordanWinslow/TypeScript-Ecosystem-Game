export class Cell {
  contents: Array<Lion | Zebra | Plant | Water | Dirt>;
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

export class Animal {
  age: "newborn" | "child" | "adult" | "senior";
  // hunger and thirst are numbers between 0 - 10. If 10, animal loses health
  hungerLevel: number;
  thirstLevel: number;
  // reproductive urge is a number between 0 - 10
  reproductiveUrge: number;
  speed: number;
  // health is a number between 0 - 10 if 0 animal dies
  health: number;
  // All animals are obstacles unless deceased
  isObstacle: boolean;
  // If false, animal is alive
  deceased: boolean;
  icon: string;

  constructor(icon: string) {
    this.icon = icon;
    this.speed = 1;
    this.age = "adult";
    this.health = 10;
    this.thirstLevel = 0;
    this.hungerLevel = 0;
    this.reproductiveUrge = 0;
    this.isObstacle = true;
    this.deceased = false;
  }

  getGreatestDesire() {
    const wantsToReproduce =
      this.reproductiveUrge > this.thirstLevel &&
      this.reproductiveUrge > this.hungerLevel &&
      this.hungerLevel <= 5 &&
      this.thirstLevel <= 5;

    const wantsToEat =
      this.hungerLevel !== 0 && this.hungerLevel > this.thirstLevel;

    const wantsToDrink =
      this.thirstLevel !== 0 && this.thirstLevel >= this.hungerLevel;

    if (wantsToReproduce) {
      return "looking for mate";
    } else if (wantsToEat) {
      return "looking for food";
    } else if (wantsToDrink) {
      return "looking for water";
    }
  }

  increaseDesires() {
    if (this.hungerLevel !== 10) {
      this.hungerLevel++;
    }
    if (this.thirstLevel !== 10) {
      this.thirstLevel++;
    }
    if (this.reproductiveUrge !== 10) {
      this.reproductiveUrge++;
    }
  }

  eat() {
    // could update this method to take in a food source with varying nutritionalValue
    this.gainHealth(5);
    if (this.hungerLevel > 0) {
      if (this.hungerLevel <= 5) {
        this.hungerLevel = 0;
      } else {
        this.hungerLevel = this.hungerLevel - 5;
      }
    }
  }

  drink() {
    this.gainHealth(5);
    if (this.thirstLevel > 0) {
      if (this.thirstLevel <= 5) {
        this.thirstLevel = 0;
      } else {
        this.thirstLevel = this.thirstLevel - 5;
      }
    }
  }

  loseHealth(healthToLose: number) {
    this.health = this.health - healthToLose;
    if (this.health <= 0) {
      this.setDeceased();
    }
  }

  gainHealth(healthToGain: number) {
    if (this.health + healthToGain > 10) {
      this.health = 10;
    } else {
      this.health = this.health + healthToGain;
    }
  }

  setDeceased() {
    console.log("ANIMAL DIED!");

    this.deceased = true;
    this.icon = "🪦";
    this.isObstacle = false;
  }
}

export class Lion extends Animal {
  type = "lion";

  constructor() {
    super("🦁");
  }
}

export class Zebra extends Animal {
  type = "zebra";

  constructor() {
    super("🦓");
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
