import BaseEntity from "../BaseEntity.js";
import {assetsManager} from "../../../helpers/AssetsManager.js";

export default class Star extends BaseEntity {
  constructor(data) {
    super(data);

    this.initProperties(data);
    this.init();
  }

  initProperties(data) {
    this.entityId = data.entityId;
  }

  init() {
    const {entityId} = this;

    const texture = assetsManager.getFromStorage("texture", entityId);

    const view = this.view ??= new PIXI.Sprite();

    view.texture = texture;
    view.anchor.set(0.5);
  }
}