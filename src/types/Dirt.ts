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