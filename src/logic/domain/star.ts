export enum StarColor {
  Indigo = "#4b0082",
  Teal = "#008080",
  Magenta = "#ff00ff",
  Silver = "#c0c0c0",
}

let nextStarId = 1;

export type StarId = `star-${number}`;
function generateStarId(): StarId {
  return `star-${nextStarId++}`;
}

/**
 * Base class for star
 */
export class Star {
  private _id: StarId;
  private _count = 0;

  constructor(
    private _name: string,
    private _color: StarColor,
  ) {
    this._id = generateStarId();
  }

  get id(): StarId {
    return this._id;
  }

  get count() {
    return this._count;
  }

  get name() {
    return this._name;
  }

  get color() {
    return this._color;
  }

  public addStar(amount = 1) {
    this._count += amount;
  }

  public removeStar(amount: number) {
    this._count -= amount;
  }

  static fromColor(color: StarColor) {
    switch (color) {
      case StarColor.Indigo: {
        return new IndigoStar();
      }
      case StarColor.Teal: {
        return new TealStar();
      }
      case StarColor.Magenta: {
        return new MagentaStar();
      }
      case StarColor.Silver: {
        return new SilverStar();
      }
      default: {
        throw new Error(`Unknown star color: ${color}`);
      }
    }
  }
}

export class IndigoStar extends Star {
  constructor() {
    super("indigo", StarColor.Indigo);
  }
}

export class TealStar extends Star {
  constructor() {
    super("teal", StarColor.Teal);
  }
}

export class MagentaStar extends Star {
  constructor() {
    super("magenta", StarColor.Magenta);
  }
}

export class SilverStar extends Star {
  constructor() {
    super("silver", StarColor.Silver);
  }
}
