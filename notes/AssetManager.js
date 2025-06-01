import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class AssetManager {
  constructor() {
    this.textureLoader = new THREE.TextureLoader();
    this.gltfLoader = new GLTFLoader();
    this.textures = new Map();
    this.models = new Map();
  }

  loadTexture(name, url) {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        url,
        (texture) => {
          this.textures.set(name, texture);
          resolve(texture);
        },
        undefined,
        reject,
      );
    });
  }

  loadModel(name, url) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          this.models.set(name, gltf.scene);
          resolve(gltf.scene.clone());
        },
        undefined,
        reject,
      );
    });
  }

  getTexture(name) {
    return this.textures.get(name);
  }

  getModel(name) {
    const model = this.models.get(name);
    return model ? model.clone() : null;
  }
}

// usage
const assets = new AssetManager();

// Define all assets to be loaded.
// Loading will be attempted in parallel for potentially faster overall completion.
const assetsToLoad = [
  { type: "texture", name: "whiteTile", path: "/textures/white.png" },
  { type: "model", name: "knight", path: "/models/knight.glb" },
  // Add more assets here, for example:
  // { type: "texture", name: "groundTexture", path: "/textures/ground.jpg" },
  // { type: "model", name: "treeModel", path: "/models/tree.glb" },
];

// Create an array of loading promises.
const loadingPromises = assetsToLoad.map(assetInfo => {
  switch (assetInfo.type) {
    case "texture":
      return assets.loadTexture(assetInfo.name, assetInfo.path);
    case "model":
      return assets.loadModel(assetInfo.name, assetInfo.path);
    default:
      console.warn(`Unknown asset type "${assetInfo.type}" for asset "${assetInfo.name}". This asset will be skipped.`);
      // Return a resolved promise for unknown types to allow Promise.all to proceed
      // with other valid assets. This specific asset will not be loaded.
      return Promise.resolve();
  }
});

try {
  // Wait for all assets to load in parallel.
  // If any asset's loadTexture/loadModel promise rejects, Promise.all will reject,
  // and the .catch() block below will be executed.
  await Promise.all(loadingPromises);
  console.log("All specified asset loading operations have completed.");

  // Using the loaded assets:
  // (Assuming 'scene' is defined in an outer scope, e.g., `const scene = new THREE.Scene();`)

  const whiteTileTexture = assets.getTexture("whiteTile");

  // The Tile instantiation signature is based on the original selection.
  // Context: `src/ui/renderer/tile.ts` (provided context file) shows
  // `class Tile extends Mesh` with `constructor(textureInput?: Texture)`.
  // If using that specific Tile class, instantiation might look like:
  // `const tile = new Tile(whiteTileTexture); tile.position.set(0, 0, 1);`
  // The original selection's `Tile(0,0,1, texture)` implies a different constructor or setup.
  const tile = new Tile(0, 0, 1, whiteTileTexture); // Assuming Tile constructor handles potentially undefined texture.
  scene.add(tile);

  const knightModel = assets.getModel("knight");
  if (knightModel) {
    scene.add(knightModel);
  } else {
    // This path would be taken if 'knight' was not loaded (e.g., skipped due to an unknown type
    // in assetsToLoad, or if its name in assetsToLoad doesn't match "knight").
    // If its loading promise (from loadModel) had rejected, the main .catch() block for Promise.all
    // would typically have been hit, and this code section might not execute,
    // depending on error handling in the catch block.
    console.warn("Knight model could not be retrieved from AssetManager. Check if it was defined correctly in assetsToLoad and loaded successfully.");
  }

} catch (error) {
  console.error("A critical error occurred during parallel asset loading:", error);
  // This typically means at least one asset's load() promise (from loadTexture/loadModel) rejected.
  // The AssetManager might still contain assets that loaded successfully before the error.
  // Further actions depend on how critical the failed asset(s) are for the application.
}
