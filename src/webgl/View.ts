/*
 * View.ts
 * ===========
 * Topmost Three.js class.
 * Controls scene, cam, renderer, and objects in scene.
 */

import * as THREE from 'three';

import SceneObject from './SceneObject';

export type SceneObjects = {
  scene: SceneObject[];
  [key: string]: SceneObject[];
};

export default class View {
  public enableStats = true;
  public enableControls = true;

  protected renderer: THREE.WebGLRenderer;
  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  protected objects: SceneObjects = { scene: [] };

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    // this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.01, 300);
    this.camera.position.z = 15;

    this.scene = new THREE.Scene();
  }

  protected setupObjects() {
    this.scene && this.addObjectsToScene(this.scene, this.objects.scene);
  }

  protected initObjects() {
    this.objects = this.createObjects();
  }

  protected createObjects(): SceneObjects {
    return { scene: [] };
  }

  protected updateObjects(secs: number, mousePos: [number, number]) {
    for (const objects of Object.values(this.objects)) {
      objects.forEach((o) => o.update(secs, mousePos));
    }
  }

  protected render() {
    this.scene && this.renderer.render(this.scene, this.camera);
  }

  protected addObjectsToScene(scene: THREE.Scene, objects?: SceneObject[]) {
    objects?.length && scene.add(...objects.map((o) => o.object));
  }

  start() {
    this.initObjects();
    this.setupObjects();
    this.onWindowResize(window.innerWidth, window.innerHeight);
  }

  getCamera() {
    return this.camera;
  }

  getScene() {
    return this.scene;
  }

  onWindowResize(w: number, h: number) {
    const aspect = w / h;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(w, h);
  }

  update(secs: number, mousePos: [number, number]) {
    this.updateObjects(secs, mousePos);
    this.render();
  }
}
