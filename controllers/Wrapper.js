import EventDispatcher from "../helpers/EventDispatcher.js";
import Storage from "../helpers/Storage.js";
import LocalTimeline from "../utils/gsap/LocalTimeline.js";

// Фасад, для упрощенного общения с игрой через него
export default class Wrapper {

  eventDispatcher = new EventDispatcher();

  constructor({tweensSpace, container, assetsData}) {
    this.container = container;
    this.storage = new Storage({assetsData});
    this.tweensSpace = tweensSpace;
  }

  async prepareScene() {
    const {storage, tweensSpace} = this;

    if (typeof tweensSpace === "string") {
      gsap.localTimeline = new LocalTimeline();
      gsap.localTimeline.createSpace(tweensSpace);
    }

    await storage.load();
  }

  initController({ControllerConstructor, stateMachine, gameSettings}) {
    const {container, eventDispatcher, tweensSpace, storage} = this;
    return this.controller = new ControllerConstructor({
      container, eventDispatcher, tweensSpace, storage, stateMachine, gameSettings
    });
  }
}