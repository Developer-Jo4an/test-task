import {eventSubscription} from "../../utils/events/eventSubscription.js";

export default class BaseGameController {
  constructor({app, stage, storage, renderer, eventDispatcher, state, container, stateMachine}) {
    this.app = app;
    this.stage = stage;
    this.storage = storage;
    this.renderer = renderer;
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

  onStateChanged(state) {

  }

  update(deltaTime) {

  }

  destroy() {

  }
}