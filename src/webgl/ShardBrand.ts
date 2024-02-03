import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import SceneObject from './SceneObject';
import shardObj from './models/shard.obj';

export default class Shard extends SceneObject {
  // timeU: THREE.IUniform;

  constructor({
    material: materialOverride,
  }: { material?: THREE.Material } = {}) {
    super();

    const obj = new OBJLoader().parse(shardObj);

    const group = new THREE.Group();

    const hdrEquirect =
      (!materialOverride &&
        new RGBELoader().load('textures/empty_warehouse_01_2k.hdr', () => {
          if (hdrEquirect)
            hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
        })) ||
      null;

    const material =
      materialOverride ||
      new THREE.MeshPhysicalMaterial({
        transmission: 1,
        thickness: 2.5,
        ior: 1.6,
        roughness: 0.3,
        envMap: hdrEquirect,
        envMapIntensity: 0.3,
        side: THREE.DoubleSide,
      });

    obj.traverse((o: any) => {
      if (o.isMesh) {
        o.material = material;
        group.add(o);
      }
    });

    group.scale.set(2, 2, 2);
    // group.translateX(-3.5);

    this.object = group;
    // const mesh = new THREE.Mesh(geometry, material);
  }

  update(secs: number, mousePos: [number, number]) {
    super.update(secs, mousePos);

    const rotationX = 0.4 + (mousePos[0] / window.innerWidth - 0.5) * 0.5;
    const rotationY = 0.1 + (mousePos[1] / window.innerHeight - 0.5) * 0.1;

    this.object.rotation.set(
      rotationY + Math.sin(secs / 10) * 0.1,
      // Math.sin(secs / 10) * 2 * Math.PI,
      rotationX + Math.sin((secs + 100) / 10) * 0.2,
      // Math.cos(secs / 10) * 2 * Math.PI,
      0.2
    );
  }
}
