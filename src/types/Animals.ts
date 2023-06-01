import chance from "chance";
import { AnimalDesires } from "../constants/AnimalDesiresEnum";

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
    // this.speed = 1;
    // this.age = "adult";
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
      return AnimalDesires.Reproduce;
    } else if (wantsToEat) {
      return AnimalDesires.Food;
    } else if (wantsToDrink) {
      return AnimalDesires.Water;
    } else return "";
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
    console.log(`${this.type} is eating`);
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
    console.log(`${this.type} is drinking water`);
    // prevents animals from living indefinately off water alone
    if (this.hungerLevel === 10) {
      console.log(`${this.type} is too hungry to drink properly`);
      this.gainHealth(2);
    } else {
      this.gainHealth(5);
    }
    if (this.thirstLevel > 0) {
      if (this.thirstLevel <= 5) {
        this.thirstLevel = 0;
      } else {
        this.thirstLevel = this.thirstLevel - 5;
      }
    }
  }

  loseHealth(healthToLose: number) {
    console.log(`${this.type} is losing ${healthToLose} health`);
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
    console.log(`${this.type} has died!`);
    this.health = 0;
    this.deceased = true;
    this.icon = "🪦";
    this.isObstacle = false;
  }

  getTooltipText() {
    const currentDesire = this.getGreatestDesire();

    if (this.deceased) {
      const t = this.type;
      // Capitalize "zebra" or "lion" to "Zebra" & "Lion"
      const type = t.substring(0, 1).toUpperCase().concat(t.substring(1));
      // to make use of tooltip pre-wrap we can't allow the code formatter to indent our strings.
      return `☠ Here Lies ${this.id} The ${type} Who Died While ${currentDesire}`;
    } else {
      return `${this.id}
${currentDesire}
Health: ${this.health}`;
    }
  }
}

export class Lion extends Animal {
  constructor() {
    super("lion", "🦁");
  }

  reproduce() {
    this.reproductiveUrge = 0;
    return new Lion();
  }
}

export class Zebra extends Animal {
  constructor() {
    super("zebra", "🦓");
  }

  reproduce() {
    this.reproductiveUrge = 0;
    return new Zebra();
  }
}
