export class Plant {
  type: "tree" | "grass";
  // trees are obstacles, grass is not
  isObstacle: boolean;
  // nutritionalValue: number;

  constructor(type: Plant["type"]) {
    this.type = type;
    this.isObstacle = type === "tree";
    // this.nutritionalValue = 50;
  }
}

export class Tree extends Plant {
  icon = "🌳";

  constructor() {
    super("tree");
  }
}

export class Grass extends Plant {
  icon = "🌱";

  constructor() {
    super("grass");
  }
}
