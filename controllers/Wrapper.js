import EventDispatcher from "../helpers/EventDispatcher.js";
import Storage from "../helpers/Storage.js";
import LocalTimeline from "../utils/gsap/LocalTimeline.js";

// Фасад, для упрощенного общения с игрой через него
export default class Wrapper {

  eventDispatcher = new EventDispatcher();

  constructor({tweenSpaces, container, assetsData}) {
    this.container = container;
    this.storage = new Storage({assetsData});
    this.tweenSpaces = tweenSpaces;
  }

  async prepareScene() {
    const {storage, tweenSpaces} = this;

    if (typeof tweenSpaces === "string") {
      gsap.localTimeline = new LocalTimeline();
      gsap.localTimeline.createSpace(tweenSpaces);
    }

    await storage.load();
  }

  initController({ControllerConstructor, stateMachine, gameSettings}) {
    const {container, eventDispatcher, storage} = this;
    return this.controller = new ControllerConstructor({
      container, eventDispatcher, storage, stateMachine, gameSettings
    });
  }
}