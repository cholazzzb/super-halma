import { Texture, TextureLoader } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";

import { Asset, Assets } from "@/data/asset";

export class AssetManager {
  private textureLoader: TextureLoader;
  private textures: Map<string, Texture>;

  private gltfLoader: GLTFLoader;
  private models: Map<string, GLTF["scene"]>;

  public status: "loading" | "loaded" | "error" | "idle" = "idle";

  constructor() {
    this.textureLoader = new TextureLoader();
    this.textures = new Map();

    this.gltfLoader = new GLTFLoader();
    this.models = new Map();
  }

  async init(assets: Assets) {
    this.status = "loading";
    try {
      const promises = assets.map((asset) => {
        switch (asset.type) {
          case "model": {
            return this.loadModel(asset.name, asset.path);
          }
          // case "texture": {
          //   return this.loadTexture(asset.name, asset.path);
          // }
          default:
            console.warn(
              `Unknown asset type "${asset.type}" for asset "${asset.name}". This asset will be skipped.`,
            );
            return Promise.resolve();
        }
      });
      const result = await Promise.all(promises);
      this.status = "loaded";
      return result;
    } catch (e) {
      this.status = "error";
      throw e;
    }
  }

  loadTexture(name: string, url: string): Promise<Texture> {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        url,
        (texture) => {
          this.textures.set(name, texture);
          resolve(texture);
        },
        undefined,
        (err) => {
          reject(
            new Error(`Failed to load texture "${name}" from "${url}": ${err}`),
          );
        },
      );
    });
  }

  loadModel(name: Asset["name"], url: string): Promise<GLTF["scene"]> {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          this.models.set(name, gltf.scene);
          resolve(gltf.scene.clone());
        },
        undefined,
        (err) => {
          reject(
            new Error(`Failed to load model "${name}" from "${url}": ${err}`),
          );
        },
      );
    });
  }

  getTexture(name: string) {
    return this.textures.get(name);
  }

  getModel(name: Asset["name"]) {
    const model = this.models.get(name);
    return model ? model.clone(true) : null;
  }
}
