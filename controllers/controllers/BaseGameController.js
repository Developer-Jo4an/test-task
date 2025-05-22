import {eventSubscription} from "../../utils/events/eventSubscription.js";

export default class BaseGameController {
  constructor(
    {
      app, stage, storage, tweensSpace, renderer, canvas, gameSettings, eventDispatcher, state, container, stateMachine
    }) {
    this.app = app;
    this.stage = stage;
    this.storage = storage;
    this.tweensSpace = tweensSpace;
    this.renderer = renderer;
    this.canvas = canvas;
    this.gameSettings = gameSettings;
    this.eventDispatcher = eventDispatcher;
    this.state = state;
    this.container = container;
    this.stateMachine = stateMachine;

    this.baseInit();
  }

  baseInit() {
    this.baseInitEvents();
  }

  baseInitEvents() {
    const {eventDispatcher} = this;

    const callbacksBus = [
      {
        event: "state:changed", callback: ({state}) => {
          this.state = state;
          this.onStateChanged(state);
        }
      }
    ];

    eventSubscription({target: eventDispatcher, callbacksBus});
  }

  setState(state) {
    const {eventDispatcher} = this;

    eventDispatcher.dispatchEvent({type: "state:change", state});
  }

  onStateChanged(state) {

  }

  update(deltaTime) {

  }

  destroy() {

  }
}