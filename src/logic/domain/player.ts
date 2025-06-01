let nextPlayerId = 1;

export type PlayerId = `player-${number}`;
function generatePlayerId(): PlayerId {
  return `player-${nextPlayerId++}`;
}

export class Player {
  private _id: PlayerId;

  constructor(
    public color: number,
    public highlightColor: number,
  ) {
    this._id = generatePlayerId();
  }

  get id(): PlayerId {
    return this._id;
  }
}
