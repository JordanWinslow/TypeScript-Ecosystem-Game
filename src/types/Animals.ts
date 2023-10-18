import chance from "chance";

export class Animal {
  id: string;
  icon: string;
  type: "lion" | "zebra";
  // hunger and thirst are numbers between 0 - 10. If 10, animal loses health
  hungerLevel: number;
  thirstLevel: number;
  // reproductive urge is a number between 0 - 10
  reproductiveUrge: number;
  // health is a number between 0 - 10 if 0 animal dies
  health: number;
  // All animals are obstacles unless deceased
  isObstacle: boolean;
  // If false, animal is alive
  deceased: boolean;
  // age: "newborn" | "child" | "adult" | "senior";
  // speed: number;

  constructor(type: Animal["type"], icon: string) {
    this.id = chance().name();
    this.type = type;
    this.icon = icon;
    this.health = 10;
    this.thirstLevel = 0;
    this.hungerLevel = 0;
    this.reproductiveUrge = 0;
    this.isObstacle = true;
    this.deceased = false;
  }

  getGreatestDesire() {
    return "Thirsty";
  }

  increaseDesires() {
    // TODO
  }

  eat() {
    // TODO
  }

  drink() {
    // TODO
  }

  loseHealth(healthToLose: number) {
    // TODO
  }

  gainHealth(healthToGain: number) {
    // TODO
  }

  setDeceased() {
    // TODO
  }

  getTooltipText() {
    // TODO
  }
}

export class Lion extends Animal {
  constructor() {
    super("lion", "🦁");
  }

  reproduce() {
    // this.reproductiveUrge = 0;
    // return new Lion();
  }
}

export class Zebra extends Animal {
  constructor() {
    super("zebra", "🦓");
  }

  reproduce() {
    // this.reproductiveUrge = 0;
    // return new Zebra();
  }
}
