import * as THREE from 'three';
import SceneObject from './SceneObject';

export default class Background extends SceneObject {
  constructor() {
    super();

    const texture = new THREE.TextureLoader().load('textures/bg.jpg');
    texture.colorSpace = THREE.SRGBColorSpace;

    // const geometry = new THREE.SphereGeometry(20, 255, 255);
    // const geometry = new THREE.CylinderGeometry(20, 20, 30);
    const geometry = new THREE.PlaneGeometry(5, 5);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });

    this.object = new THREE.Mesh(geometry, material);
    // this.object.position.set(0, 0, 15);
    this.object.position.set(0, 0, -15);
    this.object.scale.set(5, 5, 1);
  }

  update(time: number, currentTime: number, mousePos: [number, number]) {
    // this.object.rotation.set(
    //   0,
    //   Math.sin(secs / 100) * -2 * Math.PI,
    //   // Math.cos(secs / 100) * -2 * Math.PI,
    //   0
    // );
  }
}
