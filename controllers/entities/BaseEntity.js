import {gameFactory} from "../factory/GameFactory.js";
import {eventSubscription} from "../../utils/events/eventSubscription.js";

export default class BaseEntity {
  constructor(data) {
    this.initBaseProperties(data);
    this.initBaseEvents();
  }

  initBaseEvents() {
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

  initBaseProperties({id, type, state, storage, stage, eventDispatcher}) {
    const fieldsObject = {id, type, state, storage, stage, eventDispatcher};

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
    this.initBaseEvents(data);
  }

  destroy() {
    if (this.type)
      gameFactory.clearItemByEntity(this.type, this);
  }
}