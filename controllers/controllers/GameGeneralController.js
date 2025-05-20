import BaseController from "../BaseController.js";
import GridController from "./GridController.js";
import {createGameFactory} from "../factory/GameFactory.js";
import {createUtils} from "../utils/GameUtils.js";
import {gameSize} from "../../constants/game.js";

export default class GameGeneralController extends BaseController {

  static controllersClasses = [GridController];

  controllers = [];

  constructor(data) {
    super(data);

    const {gameSettings} = data;

    this.gameSettings = gameSettings;

    this.init();
  }

  createControllersSelect() {
    const {app, stage, storage, renderer, gameSettings, eventDispatcher, state, container, stateMachine} = this;

    const generalData = {app, stage, storage, renderer, gameSettings, eventDispatcher, state, container, stateMachine};

    createGameFactory(generalData);
    createUtils(generalData);

    this.controllers = GameGeneralController.controllersClasses.map(ControllerConstructor => {
      const controller = new ControllerConstructor(generalData);
      controller.init();
    });
  }

  initializationSelect() {
    this.isActive = true;
  }

  update(deltaTime) {
    const {controllers} = this;
    console.log(controllers);
    controllers.forEach(controller => controller.update(deltaTime));
  }

  onResize(data) {
    const {width, height} = super.onResize(data);
    const scale = Math.min(width / gameSize.width/*, height / GAME_SIZE.height*/);
    this.stage.scale.set(scale);
    this.stage.position.set(
      (width - gameSize.width * scale) / 2,
      (height - gameSize.height * scale) / 2
    );
  }
}