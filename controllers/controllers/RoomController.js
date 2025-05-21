import {gameFactory} from "../factory/GameFactory.js";
import {gameSize} from "../../constants/game.js";
import BaseGameController from "./BaseGameController.js";

export default class RoomController extends BaseGameController {
  constructor(data) {
    super(data);
  }

  init() {
    ["light", "dark"].map(prefix => {
      const id = `${prefix}Room`;
      gameFactory.createItem("room", {id, entityId: id});
    });
  }

  initializationSelect() {
    const {stage} = this;

    const rooms = gameFactory.getCollectionByType("room");

    const grid = gameFactory.getItemById("grid", "gameGrid");

    const limitation = gameSize.height - grid.view.height;

    rooms.forEach(room => {
      room.updateLayout(limitation);
      stage.addChild(room.view);
    });

    const [, darkRoom] = rooms;

    darkRoom.view.mask = new PIXI.Graphics();

    darkRoom.view.mask
    .beginFill(0xffffff)
    .drawRect(gameSize.width / 2 - darkRoom.view.width / 2, 0, gameSize.width / 2, limitation)
    .endFill();

    stage.addChild(darkRoom.view.mask);
  }
}