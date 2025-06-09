import {
  AmbientLight,
  DirectionalLight,
  Fog,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

import { Terrain } from "@/logic/domain/terrain";
import { isProd } from "@/shared-logic/env";
import { AssetManager } from "./asset-manager";

export class ThreeApp {
  public renderer: WebGLRenderer;
  public scene: Scene;
  public camera: PerspectiveCamera;
  public controls: OrbitControls;
  public assetManager: AssetManager;

  // Debugger
  public gui?: GUI;
  public stats?: Stats;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = this.initRenderer(canvas);
    this.scene = this.initScene();
    this.camera = this.initCamera();
    this.controls = this.initControls();
    this.assetManager = new AssetManager();

    if (!isProd) {
      const { gui, stats } = this.initDebugger();
      this.gui = gui;
      this.stats = stats;
    }
  }

  start() {
    this.renderer.setAnimationLoop(this.animate.bind(this));
  }

  private initRenderer(canvas: HTMLCanvasElement) {
    const renderer = new WebGLRenderer({
      canvas,
    });
    renderer.setClearColor(0x80b0ff);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(devicePixelRatio);

    return renderer;
  }

  private initScene() {
    const scene = new Scene();
    scene.fog = new Fog(0x80b0ff, 10, 40);

    const sun = new DirectionalLight();
    sun.intensity = 10;
    sun.position.set(100, 2000, 100);
    scene.add(sun);

    const ambient = new AmbientLight();
    ambient.intensity = 0.5;
    scene.add(ambient);

    return scene;
  }

  private initCamera() {
    const camera = new PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.layers.enable(1);
    camera.position.set(1.4 * Terrain.width, 5, 1.4 * Terrain.height);

    return camera;
  }

  private initControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.target.set(
      Math.floor(Terrain.width / 2),
      0,
      Math.floor(Terrain.height / 2),
    );
    controls.update();
    return controls;
  }

  private initDebugger() {
    const stats = new Stats();
    document.body.appendChild(stats.dom);

    const gui = new GUI();

    return { stats, gui };
  }

  private animate() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    if (this.stats) {
      this.stats.update();
    }
  }
}
