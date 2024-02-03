import * as THREE from 'three';

export default class SceneObject {
  object: THREE.Mesh | THREE.Group = new THREE.Group();

  constructor() {}

  update(secs: number, mousePos: [number, number]) {}
}
