import * as THREE from 'three';
import SceneObject from './SceneObject';

export default class DepthDebug extends SceneObject {
  constructor() {
    super();

    const geometry = new THREE.PlaneGeometry(75, 75, 1, 1);
    const material = new THREE.MeshDepthMaterial();

    this.object = new THREE.Mesh(geometry, material);

    this.object.translateZ(-100);
  }
}
