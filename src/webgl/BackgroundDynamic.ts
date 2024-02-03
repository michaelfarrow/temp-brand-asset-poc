import * as THREE from 'three';
import SceneObject from './SceneObject';

import vertShader from './glsl/bg.vs';
import fragShader from './glsl/bg.fs';

const palletes: string[][] = require('nice-color-palettes');
let randPallete = Math.floor(Math.random() * palletes.length);
randPallete = 3;
const pallete = palletes[randPallete].map((c) => new THREE.Color(c));

export default class BackgroundDynamic extends SceneObject {
  time: THREE.IUniform<number>;

  constructor() {
    super();

    const geometry = new THREE.PlaneGeometry(30, 100, 10, 10);

    // const material = new THREE.MeshBasicMaterial({
    //   color: 0xff0000,
    //   wireframe: true,
    // });

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPallete: { value: pallete },
      },
      vertexShader: vertShader,
      fragmentShader: fragShader,
    });

    this.time = material.uniforms.uTime;
    this.object = new THREE.Mesh(geometry, material);

    this.object.translateZ(-20);
  }

  update(secs: number) {
    this.time.value = secs;
  }
}
