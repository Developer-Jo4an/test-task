import BaseEntity from "../BaseEntity.js";
import {assetsManager} from "../../../helpers/AssetsManager.js";
import {gameFactory} from "../../factory/GameFactory.js";
import {gameSize} from "../../../constants/game.js";

export default class Room extends BaseEntity {
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

    const view = this.view ??= new PIXI.Container();
    view.sortableChildren = true;

    const roomTexture = assetsManager.getFromStorage("texture", entityId);
    const room = this.backgrpund ??= new PIXI.Sprite();
    room.texture = roomTexture;
    room.anchor.set(0.5);
    view.addChild(room);

    const {view: characterView, shadow, eyes} = gameFactory.createItem("character", {id: `character:${entityId}`});
    characterView.position.set(-room.width * 0.314, -room.height * 0.142);
    shadow.position.set(characterView.width - shadow.width, 0);
    eyes.position.set(characterView.width * 0.083, characterView.height * 0.099);

    view.addChild(characterView);
  }

  updateLayout(limitation) {
    const {view} = this;

    view.scale.set(1);

    const scale = limitation / view.height;

    view.scale.set(scale);

    view.position.set(gameSize.width / 2, limitation / 2);
  }
}