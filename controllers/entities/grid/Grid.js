import BaseEntity from "../BaseEntity.js";
import {assetsManager} from "../../../helpers/AssetsManager.js";
import {gameSize} from "../../../constants/game.js";

export default class Grid extends BaseEntity {
  constructor(data) {
    super(data);

    this.init();
  }

  init() {
    const view = this.view ??= new PIXI.Container();
    view.sortableChildren = true;
  }

  setBackground() {
    const {view, gameSettings: {grid: {padding}}} = this;
    view.zIndex = 1;

    const {y: height} = view.getLocalBounds();

    const backgroundTexture = assetsManager.getFromStorage("texture", "gridBackground");
    const background = this.background ??= new PIXI.Sprite(backgroundTexture);
    background.anchor.set(0, 1);
    background.scale.set(1);
    background.scale.set(gameSize.width / background.width, (-height + padding) / background.height);
    background.zIndex = -1;
    view.addChild(background);

    const backgroundCapTexture = assetsManager.getFromStorage("texture", "gridBackgroundCap");
    const backgroundCap = this.backgroundCap ??= new PIXI.Sprite(backgroundCapTexture);
    backgroundCap.anchor.set(0, 1);
    backgroundCap.scale.set(1);
    backgroundCap.scale.set(gameSize.width / backgroundCap.width);
    backgroundCap.zIndex = -1;
    backgroundCap.position.set(0, (height - padding));
    view.addChild(backgroundCap);
  }

  reset(data) {
    super.reset(data);
  }

  destroy() {
    const {view} = this;

    view.removeChildren();
    view.position.set(0, 0);

    super.destroy();
  }
}