import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import SceneObject from './SceneObject';
import { MeshTransmissionMaterial } from '@pmndrs/vanilla';

const HEIGHT = 500;

export default class Shard extends SceneObject {
  // timeU: THREE.IUniform;

  constructor({
    material: materialOverride,
  }: { material?: THREE.Material } = {}) {
    super();

    const geometry = new THREE.BufferGeometry();

    const a1 = new THREE.Vector3(0, 0, 0);
    const a2 = new THREE.Vector3(1450, -308, 0);
    const a3 = new THREE.Vector3(1026, 539, 0);

    const b1 = new THREE.Vector3(859, 11, HEIGHT);
    const b2 = new THREE.Vector3(1050, -27, HEIGHT);
    const b3 = new THREE.Vector3(1109, 245, HEIGHT);

    const m1 = new THREE.Vector3(920, -194, 0);
    const m2 = new THREE.Vector3(1199, 200, 0);
    const m3 = new THREE.Vector3(710, 373, 0);

    geometry.setFromPoints(
      [
        [a1, m1, b1],
        [b2, b1, m1],
        [m1, a2, b2],
        [b3, b2, a2],
        [a2, a3, b3],
        // [a2, b2, m2],
        // [m2, b2, b3],
        // [m2, b3, a3],
        [b1, b3, a3],
        [a1, b1, a3],
        [b1, b2, b3],
      ].flat()
    );

    const uvs = [
      [0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 0],
    ].flat();

    geometry.computeVertexNormals();
    // geometry.setAttribute(
    //   'uv',
    //   new THREE.BufferAttribute(new Float32Array(uvs), 2)
    // );

    // const mat = new THREE.ShaderMaterial({
    //   uniforms: {
    //     time: { value: 0 },
    //     color: { value: new THREE.Color(0xeeeeee) },
    //     // lightDirection: {
    //     //   value: new THREE.Vector3(-2.0, 2.0, 1.5).normalize(),
    //     // },
    //   },
    //   vertexShader: vertShader,
    //   fragmentShader: fragShader,
    //   side: THREE.DoubleSide,
    // });

    // const material = new THREE.MeshBasicMaterial({
    //   color: 0xff0000,
    //   side: THREE.DoubleSide,
    //   wireframe: true,
    // });

    // const self = this;

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
        thickness: 1500,
        roughness: 0.25,
        envMap: hdrEquirect,
        envMapIntensity: 0.2,
        side: THREE.DoubleSide,
      });

    // const material = new MeshTransmissionMaterial({
    //   _transmission: 1,
    //   thickness: 0,
    //   roughness: 0,
    //   chromaticAberration: 0.03,
    //   anisotropicBlur: 0.1,
    //   distortion: 0,
    //   distortionScale: 0.5,
    //   temporalDistortion: 0.0,
    // });

    // const geom = new THREE.BoxGeometry(4, 4, 4);
    const geom = new THREE.BoxGeometry(4, 4, 4);

    // this.timeU = material.uniforms.time;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(0.005, 0.005, 0.005);
    mesh.translateX(-3.5);

    this.object = new THREE.Group();
    this.object.add(mesh);

    // this.object = new THREE.Mesh(geom, material);

    // new OBJLoader().load('models/gems.obj', (obj) => {
    //   obj.traverse(function (child) {
    //     if (child instanceof THREE.Mesh) {
    //       child.material = material;
    //       self.mesh = child;
    //     }
    //   });
    // });
  }

  update(time: number, currentTime: number, mousePos: [number, number]) {
    // this.timeU.value = secs;
    this.object.rotation.set(
      Math.sin(time / 10) * 2 * Math.PI,
      Math.cos(time / 10) * 2 * Math.PI,
      0
    );
  }
}
