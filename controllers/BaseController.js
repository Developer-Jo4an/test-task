import {eventSubscription} from "../utils/events/eventSubscription.js";

export default class BaseController {

  _isActive = false;

  _state;

  isTransitionState = false;

  controllers = [];

  constructor({container, storage, eventDispatcher, stateMachine, applicationSettings = {}}) {
    this.onResize = this.onResize.bind(this);
    this.update = this.update.bind(this);

    this.onStateChange = this.onStateChange.bind(this);

    this.storage = storage;
    this.eventDispatcher = eventDispatcher;
    this.container = container;
    this.stateMachine = stateMachine;
    this.applicationSettings = applicationSettings;
  }

  get stage() {
    return this.app.stage;
  }

  get renderer() {
    return this.app.renderer;
  }

  get canvas() {
    return this.renderer.view;
  }

  get state() {
    return this._state;
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

  set state(state) {
    const {eventDispatcher, stateMachine, controllers, isTransitionState} = this;

    if (this.state === state || isTransitionState) return;

    this._state = state;

    console.log(`state >>> ${state}`);

    eventDispatcher.dispatchEvent({type: "state:changed", state});

    this.isTransitionState = true;

    Promise.all([this, ...controllers].map(controller => {
      const methodKey = `${state}Select`;

      return typeof controller[methodKey] === "function"
        ? controller[methodKey].call(controller)
        : Promise.resolve();
    })).then(async (callbacks = []) => {
      callbacks?.forEach?.(callback => typeof callback === "function" && callback?.());

      this.isTransitionState = false;

      const {ignoreNext, nextState, availableStates} = stateMachine[state];

      if (!stateMachine[state].ignoreNext && stateMachine[nextState] && availableStates.includes(nextState))
        this.state = nextState;
    });
  }

  init() {
    this.initEvents();
    this.initScene();
    this.initStateControls();
  }

  initEvents() {
    const {eventDispatcher} = this;

    const sharedCallbacksBus = [
      {event: "resize", callback: this.onResize}
    ];

    eventSubscription({callbacksBus: sharedCallbacksBus});

    const localCallbacksBus = [
      {
        event: "state:change", callback: this.onStateChange
      }
    ];

    eventSubscription({target: eventDispatcher, callbacksBus: localCallbacksBus});
  }

  append() {
    const {container, canvas} = this;
    container.appendChild(canvas);
  }

  initScene() {
    const {applicationSettings} = this;

    this.app = new PIXI.Application({
      transparent: true,
      backgroundColor: 0xffffff,
      resolution: Math.max(2, globalThis.devicePixelRatio),
      autoResize: true,
      antialias: true,
      ...applicationSettings
    });

    globalThis.__PIXI_APP__ = this.app; // devtools

    this.onResize();
  }

  initStateControls() {
    const {stateMachine} = this;

    this.state = Object.entries(stateMachine).find(([, {isDefault}]) => isDefault)[0];
  }

  onStateChange({state}) {
    const {stateMachine} = this;

    if (stateMachine[this.state].availableStates.includes(state))
      this.state = state;
  }

  update(deltaTime) {

  }

  onResize() {
    const {container, canvas, renderer} = this;

    const {offsetWidth: width, offsetHeight: height} = container;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    renderer.resize(width, height);

    return {width, height};
  }
}