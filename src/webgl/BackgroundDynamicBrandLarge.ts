import * as THREE from 'three';
import Color = require('color');

import SceneObject from './SceneObject';

import vertShader from './glsl/bg-branded-reactive.vs';
import fragShader from './glsl/bg-branded-reactive.fs';

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
  const alt = colour.lighten(0.5).saturate(0.25);

  return new THREE.Color(alt.hex());
});

export default class BackgroundDynamic extends SceneObject {
  time: THREE.IUniform<number>;
  pos: THREE.IUniform<[number, number]>;

  constructor() {
    super();

    const geometry = new THREE.PlaneGeometry(70, 50, 40, 40);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPallete: { value: palleteAltered },
        uPos: { value: [0, 0] },
      },
      vertexShader: vertShader,
      fragmentShader: fragShader,
      depthWrite: false,
    });

    this.time = material.uniforms.uTime;
    this.pos = material.uniforms.uPos;
    this.object = new THREE.Mesh(geometry, material);
    this.object.rotateX(0.3);

    this.object.translateZ(-10);
  }

  update(time: number, currentTime: number, mousePos: [number, number]) {
    this.time.value = currentTime;
    this.pos.value = mousePos;
  }
}
