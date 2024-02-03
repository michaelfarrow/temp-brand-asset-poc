import View from './View3';
import BackgroundDynamic from './BackgroundDynamicBrand';
import Shard from './Shard';

export default class ViewStage extends View {
  protected createObjects() {
    return { scene: [new BackgroundDynamic(), new Shard()] };
  }
}
