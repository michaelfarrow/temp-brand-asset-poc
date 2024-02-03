import * as THREE from 'three';
import View from './View4';

import BackgroundDynamic from './BackgroundDynamicBrand';
import Shard from './Shard';

import vertShader from './glsl/compose.vs';
import fragShader from './glsl/compose.fs';

export default class ViewStage extends View {
  private depthTarget: THREE.WebGLRenderTarget;
  private renderTarget: THREE.WebGLRenderTarget;
  private postCamera: THREE.Camera;
  private postMaterial: THREE.ShaderMaterial;
  private preScene: THREE.Scene;
  private postScene: THREE.Scene;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.preScene = new THREE.Scene();

    this.depthTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight
    );
    this.depthTarget.texture.minFilter = THREE.NearestFilter;
    this.depthTarget.texture.magFilter = THREE.NearestFilter;
    this.depthTarget.stencilBuffer = false;
    this.depthTarget.depthTexture = new THREE.DepthTexture(0, 0);
    this.depthTarget.depthTexture.format = THREE.DepthFormat;
    this.depthTarget.depthTexture.type = THREE.UnsignedShortType;

    this.renderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight
    );
    this.renderTarget.texture.minFilter = THREE.NearestFilter;
    this.renderTarget.texture.magFilter = THREE.NearestFilter;

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

  protected createObjects() {
    return {
      pre: [
        new Shard({
          material: new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
        }),
      ],
      scene: [new Shard(), new BackgroundDynamic()],
    };
  }

  protected setupObjects() {
    super.setupObjects();
    this.addObjectsToScene(this.preScene, this.objects.pre);
  }

  onWindowResize(w: number, h: number) {
    super.onWindowResize(w, h);
    const dpr = this.renderer.getPixelRatio();
    this.depthTarget.setSize(w * dpr, h * dpr);
    this.renderTarget.setSize(w * dpr, h * dpr);
    // this.renderTarget.setSize(w * dpr * 2, h * dpr * 2);
  }

  protected render() {
    this.renderer.setRenderTarget(this.depthTarget);
    this.renderer.render(this.preScene, this.camera);

    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(this.scene, this.camera);

    this.postMaterial.uniforms.tDiffuse.value = this.renderTarget.texture;
    this.postMaterial.uniforms.tDepth.value = this.depthTarget.depthTexture;

    this.renderer.setRenderTarget(null);
    this.renderer.render(this.postScene, this.postCamera);
  }
}
