import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import SceneObject from './SceneObject';

export default class Shard extends SceneObject {
  private morph = 0;
  private morphVal = 0;
  private currentMorph = 0;

  constructor({
    material: materialOverride,
  }: { material?: THREE.Material } = {}) {
    super();

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

    new GLTFLoader().load('models/shard-morph.glb', (obj) => {
      obj.scene.traverse((o: any) => {
        if (o.isMesh) {
          o.material = material;
          group.add(o);
        }
      });
    });

    group.scale.set(2, 2, 2);
    group.translateY(-1);

    this.object = group;
  }

  update(
    time: number,
    currentTime: number,
    mousePos: [number, number],
    dragDelta: [number, number]
  ) {
    const rotationX = 0.4 + (mousePos[0] / window.innerWidth - 0.5) * 0.4;
    const rotationY = 0.1 + (mousePos[1] / window.innerHeight - 0.5) * 0.1;

    this.object.rotation.set(
      rotationY + Math.sin(time / 10) * 0.05,
      rotationX + Math.sin((time + 100) / 10) * 0.1,
      0.2
    );

    // this.morph = Math.max(0, Math.min(1, this.morph + dragDelta[0] / 1000));
    this.morph = this.morph + dragDelta[0] / 500;

    this.morphVal = (Math.sin(this.morph) + 1) / 2;

    this.currentMorph += (this.morphVal - this.currentMorph) / 10;

    this.object.children.forEach((o: any) => {
      if (o.isMesh) {
        o.morphTargetInfluences = [this.currentMorph];
      }
    });

    // const scale = 2 * (1 - this.currentMorph * 0.2);

    this.object.rotateY(this.currentMorph * -0.5);
    this.object.rotateX(this.currentMorph * -1);
    this.object.rotateZ(this.currentMorph * -0.25);
    // this.object.scale.set(scale, scale, scale);
  }
}
