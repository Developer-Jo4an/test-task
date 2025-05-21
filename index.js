import Wrapper from "./controllers/Wrapper.js";
import {assetsData, gameSettings, gameTweensSpaceId, stateMachine} from "./constants/game.js";
import GameGeneralController from "./controllers/controllers/GameGeneralController.js";

const wrapper = new Wrapper({container: document.getElementById("scene"), tweensSpace: gameTweensSpaceId, assetsData});
await wrapper.prepareScene();
const controller = wrapper.initController({ControllerConstructor: GameGeneralController, stateMachine, gameSettings});
controller.append();