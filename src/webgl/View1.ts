import View from './View';
import Shard from './Shard';

export default class ViewStage extends View {
  protected createObjects() {
    return { scene: [new Shard()] };
  }
}
