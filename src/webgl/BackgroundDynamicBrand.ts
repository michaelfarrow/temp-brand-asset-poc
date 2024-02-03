import * as THREE from 'three';
import Color = require('color');

import SceneObject from './SceneObject';

import vertShader from './glsl/bg-branded.vs';
import fragShader from './glsl/bg-branded.fs';

const pallete = [
  '#c4c3c9', // white (base)
  '#e9cb5a', // yellow
  '#a51b4b', // red
  '#38327c', // purple
  '#2a69ad', // blue
  '#15a3a3', // aqua
  '#116853', // green
];

const palleteAltered = pallete.map((c) => {
  const colour = Color(c);
  const alt = colour.lighten(0.5);

  return new THREE.Color(alt.hex());
});

export default class BackgroundDynamic extends SceneObject {
  time: THREE.IUniform<number>;

  constructor() {
    super();

    const geometry = new THREE.PlaneGeometry(50, 50, 20, 20);

    // const material = new THREE.MeshBasicMaterial({
    //   color: 0xff0000,
    //   wireframe: true,
    // });

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPallete: { value: palleteAltered },
      },
      vertexShader: vertShader,
      fragmentShader: fragShader,
      depthWrite: false,
    });

    this.time = material.uniforms.uTime;
    this.object = new THREE.Mesh(geometry, material);

    this.object.translateZ(-20);
  }

  update(secs: number) {
    this.time.value = secs;
  }
}
