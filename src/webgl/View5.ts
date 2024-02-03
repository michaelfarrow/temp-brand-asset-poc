import * as THREE from 'three';
import View from './View4';

import vertShader from './glsl/depth.vs';
import fragShader from './glsl/depth.fs';

export default class ViewStage extends View {
  private target: THREE.WebGLRenderTarget;
  private postCamera: THREE.Camera;
  private postMaterial: THREE.ShaderMaterial;
  private postScene: THREE.Scene;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.target = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight
    );
    this.target.texture.minFilter = THREE.NearestFilter;
    this.target.texture.magFilter = THREE.NearestFilter;
    this.target.stencilBuffer = false;
    this.target.depthTexture = new THREE.DepthTexture(0, 0);
    this.target.depthTexture.format = THREE.DepthFormat;
    this.target.depthTexture.type = THREE.UnsignedShortType;

    this.postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.postMaterial = new THREE.ShaderMaterial({
      vertexShader: vertShader,
      fragmentShader: fragShader,
      uniforms: {
        cameraNear: { value: this.camera.near },
        cameraFar: { value: this.camera.far },
        tDiffuse: { value: null },
        tDepth: { value: null },
      },
    });
    const postPlane = new THREE.PlaneGeometry(2, 2);
    const postQuad = new THREE.Mesh(postPlane, this.postMaterial);
    this.postScene = new THREE.Scene();
    this.postScene.add(postQuad);
  }

  onWindowResize(w: number, h: number) {
    super.onWindowResize(w, h);
    const dpr = this.renderer.getPixelRatio();
    this.target.setSize(w * dpr, h * dpr);
  }

  protected render() {
    this.renderer.setRenderTarget(this.target);
    this.renderer.render(this.scene, this.camera);

    this.postMaterial.uniforms.tDiffuse.value = this.target.texture;
    this.postMaterial.uniforms.tDepth.value = this.target.depthTexture;

    this.renderer.setRenderTarget(null);
    this.renderer.render(this.postScene, this.postCamera);
  }
}
