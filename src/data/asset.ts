export const assets = [
  {
    type: "model",
    name: "fire-piece",
    path: "assets/models/red-fire-piece.glb",
  },
  {
    type: "model",
    name: "water-piece",
    path: "assets/models/blue-water-piece.glb",
  },
] as const;

export type Assets = typeof assets;
export type Asset = (typeof assets)[number];
