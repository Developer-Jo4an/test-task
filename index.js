import Wrapper from "./controllers/Wrapper.js";
import {assetsData, gameSettings, gameTweensSpaceId, stateMachine} from "./constants/game.js";
import GameGeneralController from "./controllers/controllers/GameGeneralController.js";
import {eventSubscription} from "./utils/events/eventSubscription.js";

const wrapper = new Wrapper({container: document.getElementById("scene"), tweensSpace: gameTweensSpaceId, assetsData});

await wrapper.prepareScene();

const controller = wrapper.initController({ControllerConstructor: GameGeneralController, stateMachine, gameSettings});

controller.append();

const {eventDispatcher} = wrapper;

const callbacksBus = [
  {
    event: "state:changed", callback: ({state}) => {
      ({
        win: () => {
          eventDispatcher.dispatchEvent({type: "state:change", state: "reset"});
        },
        lose: () => {
          eventDispatcher.dispatchEvent({type: "state:change", state: "reset"});
        }
      })[state]?.();
    }
  }
];

eventSubscription({target: eventDispatcher, callbacksBus});