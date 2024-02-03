import View from './View';
import Background from './Background';
import Shard from './Shard';

export default class ViewStage extends View {
  protected createObjects() {
    return { scene: [new Background(), new Shard()] };
  }
}
