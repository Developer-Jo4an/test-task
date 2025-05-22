import BaseController from "../BaseController.js";
import GridController from "./GridController.js";
import RoomController from "./RoomController.js";
import GameStatsController from "./GameStatsController.js";
import SoundController from "./SoundController.js";
import {createGameFactory, gameFactory} from "../factory/GameFactory.js";
import {createUtils} from "../utils/GameUtils.js";
import {gameSize} from "../../constants/game.js";

export default class GameGeneralController extends BaseController {

  static controllersClasses = [GridController, RoomController, GameStatsController, SoundController];

  static availableUpdateStates = ["showing", "playing", "feedback"];

  controllers = [];

  constructor(data) {
    super(data);

    const {gameSettings, tweensSpace} = data;

    this.gameSettings = gameSettings;
    this.tweensSpace = tweensSpace;

    this.init();
  }

  init() {
    super.init();

    this.stage.sortableChildren = true;
    this.stage.interactive = true;
  }

  createControllersSelect() {
    const {
      app, stage, storage, renderer, canvas, tweensSpace, gameSettings, eventDispatcher, state, container, stateMachine
    } = this;

    const generalData = {
      app, stage, storage, renderer, canvas, tweensSpace, gameSettings, eventDispatcher, state, container, stateMachine
    };

    createGameFactory(generalData);
    createUtils(generalData);

    this.controllers = GameGeneralController.controllersClasses.map(ControllerConstructor => {
      const controller = new ControllerConstructor(generalData);
      controller.init();
      return controller;
    });
  }

  showingSelect() {
    this.isActive = true;
  }

  winSelect() {
    const {tweensSpace} = this;
    gsap.localTimeline.clear(tweensSpace);
    this.isActive = false;
  }

  loseSelect() {
    const {tweensSpace} = this;
    gsap.localTimeline.clear(tweensSpace);
    this.isActive = false;
  }

  update(deltaTime) {
    const {controllers} = this;
    controllers.forEach(controller => controller.update(deltaTime));
  }

  onResize(data) {
    const {width, height} = super.onResize(data);

    const scale = Math.min(width / gameSize.width, height / gameSize.height);

    this.stage.scale.set(scale);

    this.stage.position.set(
      (width - gameSize.width * scale) / 2,
      (height - gameSize.height * scale) / 2
    );
  }

  resetSelect() {
    const destroyTypes = ["cell", "aim", "target", "grid"];

    destroyTypes.forEach(type => {
      const collection = gameFactory.getCollectionByType(type) ?? [];
      collection.forEach(entity => entity.destroy());
    });
  }

  destroy() {
    this.isActive = false;
    this.controllers.forEach(controller => controller.destroy());
  }
}