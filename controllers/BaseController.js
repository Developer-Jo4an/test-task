import {eventSubscription} from "../utils/events/eventSubscription.js";

export default class BaseController {

  _isActive = false;

  _state;

  isTransitionState = false;

  controllers = [];

  constructor({container, storage, eventDispatcher, stateMachine, applicationSettings = {}}) {
    this.onResize = this.onResize.bind(this);
    this.update = this.update.bind(this);

    this.storage = storage;
    this.eventDispatcher = eventDispatcher;
    this.container = container;
    this.stateMachine = stateMachine;
    this.applicationSettings = applicationSettings;
  }

  get isActive() {
    return this._isActive;
  }

  set isActive(isActive) {
    const {app} = this;

    if (this.isActive === isActive)
      throw new Error(`Cannot update isActive: value is already ${isActive}`);

    this._isActive = isActive;

    app.ticker[isActive ? "add" : "remove"](this.update);
  }

  get state() {
    return this._state;
  }

  set state(state) {
    const {eventDispatcher, stateMachine, controllers, isTransitionState} = this;

    if (this.state === state || isTransitionState)
      throw new Error(`Cannot update state: value is already ${state} || transition is available: ${isTransitionState}`);

    this._state = state;

    console.log(`state >>> ${state}`);

    eventDispatcher.dispatchEvent("state:changed", state);

    this.isTransitionState = true;

    Promise.all([this, ...controllers].map(controller => {
      const methodKey = `${state}Select`;

      return typeof controller[methodKey] === "function"
        ? controller[methodKey].call(controller)
        : Promise.resolve();
    })).then(() => {
      this.isTransitionState = false;

      const {ignoreNext, nextState, availableStates} = stateMachine[state];

      if (!stateMachine[state].ignoreNext && stateMachine[nextState] && availableStates.includes(nextState)) {
        this.state = nextState;
      }
    });
  }

  init() {
    this.initEvents();
    this.initScene();
    this.initStateControls();
  }

  initEvents() {
    const callbacksBus = [
      {event: "resize", callback: this.onResize}
    ];

    eventSubscription({callbacksBus});
  }

  initScene() {
    const {applicationSettings} = this;

    this.app = new PIXI.Application({
      transparent: true, resolution: Math.min(2, globalThis.devicePixelRatio), autoResize: true, antialias: true,
      ...applicationSettings
    });

    globalThis.__PIXI_APP__ = this.app; // devtools

    this.stage = this.app.stage;

    this.renderer = this.app.renderer;

    this.onResize();
  }

  initStateControls() {
    const {stateMachine} = this;

    this.state = Object.entries(stateMachine).find(([, {isDefault}]) => isDefault)[0];
  }

  update(deltaTime) {

  }

  onResize() {
    const {container, renderer} = this;

    const {offsetWidth: width, offsetHeight: height} = container;

    renderer.resize(width, height);

    return {width, height};
  }
}