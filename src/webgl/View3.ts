import View from './View';
import BackgroundDynamic from './BackgroundDynamic';
import Shard from './Shard';

export default class ViewStage extends View {
  protected createObjects() {
    return { scene: [new BackgroundDynamic(), new Shard()] };
  }
}
