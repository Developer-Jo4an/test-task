import BaseGameController from "./BaseGameController.js";
import {assetsManager} from "../../helpers/AssetsManager.js";
import {eventSubscription} from "../../utils/events/eventSubscription.js";

export default class SoundController extends BaseGameController {
  constructor(data) {
    super(data);

    this.init();
  }

  init() {
    const {stage} = this;

    const background = assetsManager.getFromStorage("sound", "background");
    background.loop(true);
    background.play();

    const callbacksBus = [
      {
        event: ["click", "tap"], callback: () => {
          const click = assetsManager.getFromStorage("sound", "click");
          click.play();
        }
      }
    ];

    eventSubscription({target: stage, callbacksBus, postfix: "", actionAdd: "on", actionRemove: "off"});
  }

  winSelect() {
    const win = assetsManager.getFromStorage("sound", "win");
    win.play();
  }

  loseSelect() {
    const lose = assetsManager.getFromStorage("sound", "lose");
    lose.play();
  }
}