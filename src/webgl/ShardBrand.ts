import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import SceneObject from './SceneObject';
import shardObj from './models/shard.obj';

import vertShader from './glsl/roughness.vs';
import fragShader from './glsl/roughness.fs';

export default class Shard extends SceneObject {
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

    const roughnessMap = new THREE.TextureLoader().load(
      'textures/roughness.png'
    );

    // const roughness = new THREE.ShaderMaterial(

    // );

    const material =
      materialOverride ||
      new THREE.MeshPhysicalMaterial({
        transmission: 1,
        thickness: 6,
        // ior: 1.6,
        roughness: 1.1,
        roughnessMap,
        envMap: hdrEquirect,
        envMapIntensity: 0.4,
        side: THREE.DoubleSide,
      });

    // const material = new THREE.ShaderMaterial({
    //   vertexShader: vertShader,
    //   fragmentShader: fragShader,
    // });

    obj.traverse((o: any) => {
      if (o.isMesh) {
        o.material = material;
        group.add(o);
      }
    });

    group.scale.set(2, 2, 2);
    group.translateY(-1);

    this.object = group;
  }

  update(time: number, currentTime: number, mousePos: [number, number]) {
    const rotationX = 0.4 + (mousePos[0] / window.innerWidth - 0.5) * 0.4;
    const rotationY = 0.1 + (mousePos[1] / window.innerHeight - 0.5) * 0.1;

    this.object.rotation.set(
      rotationY + Math.sin(time / 10) * 0.05,
      rotationX + Math.sin((time + 100) / 10) * 0.1,
      0.2
    );
  }
}
