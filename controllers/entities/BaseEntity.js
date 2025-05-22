import {gameFactory} from "../factory/GameFactory.js";
import {eventSubscription} from "../../utils/events/eventSubscription.js";

export default class BaseEntity {

  _view;

  _isDestroyed;

  constructor(data) {
    this.initBaseProperties(data);
    this.initBaseEvents();
  }

  get isDestroyed() {
    return this._isDestroyed;
  }

  set isDestroyed(isDestroyed) {
    this._isDestroyed = isDestroyed;
  }

  get view() {
    return this._view;
  }

  set view(view) {
    this._view = view;
    view.name = this.id;
  }

  initBaseEvents() {
    const {eventDispatcher} = this;

    const callbacksBus = [
      {
        event: "state:changed", callback: ({state}) => {
          this.state = state;
          !this.isDestroyed && this.onStateChanged(state);
        }
      }
    ];

    eventSubscription({target: eventDispatcher, callbacksBus});
  }

  initBaseProperties({id, type, state, storage, gameSettings, stage, tweensSpace, eventDispatcher}) {
    const fieldsObject = {id, type, state, storage, gameSettings, stage, tweensSpace, eventDispatcher};

    for (const key in fieldsObject) {
      this[key] = fieldsObject[key];
      if (!fieldsObject[key]) {
        console.log(key);
        throw new Error("all entities must be truthful");
      }
    }
  }

  onStateChanged(state) {

  }

  reset(data) {
    this.initBaseProperties(data);
  }

  rememberListeners(clearFunction) {
    if (typeof this.prevClearFunction === "function")
      this.prevClearFunction();
    this.prevClearFunction = clearFunction;
  }

  destroy() {
    if (this.type)
      gameFactory.clearItemByEntity(this.type, this);
  }
}