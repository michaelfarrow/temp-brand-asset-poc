import * as THREE from 'three';

export default class SceneObject {
  object: THREE.Mesh | THREE.Group = new THREE.Group();

  constructor() {}

  update(time: number, currentTime: number, mousePos: [number, number]) {}
}
