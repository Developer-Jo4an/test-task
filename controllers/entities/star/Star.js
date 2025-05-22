import BaseEntity from "../BaseEntity.js";
import {assetsManager} from "../../../helpers/AssetsManager.js";
import {utils} from "../../utils/GameUtils.js";

export default class Star extends BaseEntity {

  _parentCell;

  constructor(data) {
    super(data);

    this.initProperties(data);
    this.init();
  }

  get parentCell() {
    return this._parentCell;
  }

  set parentCell(parentCell) {
    this._parentCell = parentCell;
  }

  initProperties(data) {
    this.entityId = data.entityId;
  }

  init() {
    const {entityId} = this;

    const {width, height} = utils.getCellSize();

    const texture = assetsManager.getFromStorage("texture", entityId);

    const view = this.view ??= new PIXI.Sprite();

    view.texture = texture;
    view.anchor.set(0.5);
    view.scale.set(1);
    view.scale.set(width * 0.9 / view.width, height * 0.9 / view.height);
  }

  reset(data) {
    super.reset(data);
    this.initProperties(data);
    this.init();
  }

  destroy() {
    super.destroy();
  }
}