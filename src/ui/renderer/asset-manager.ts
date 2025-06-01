import { Texture, TextureLoader } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/Addons.js';

export class AssetManager {
  private textureLoader;
  private textures;

  private gltfLoader;
  private models;

  constructor() {
    this.textureLoader = new TextureLoader();
    this.textures = new Map();

    this.gltfLoader = new GLTFLoader();
    this.models = new Map();
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
        reject,
      );
    });
  }

  loadModel(name: string, url: string): Promise<GLTF['scene']> {
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

  getTexture(name: string) {
    return this.textures.get(name);
  }

  getModel(name: string) {
    const model = this.models.get(name);
    return model ? model.clone() : null;
  }
}
