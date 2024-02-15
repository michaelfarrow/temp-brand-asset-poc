import * as THREE from 'three';
import View from './View7';

import BackgroundDynamic from './BackgroundDynamicBrandLarge';
import ShardMorph from './ShardMorph';

export default class ViewStage extends View {
  protected createObjects() {
    return {
      pre: [
        new ShardMorph({
          material: new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
        }),
      ],
      scene: [new ShardMorph(), new BackgroundDynamic()],
    };
  }
}
