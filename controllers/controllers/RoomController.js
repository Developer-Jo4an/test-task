import {gameFactory} from "../factory/GameFactory.js";
import {gameSize} from "../../constants/game.js";
import BaseGameController from "./BaseGameController.js";
import {eventSubscription} from "../../utils/events/eventSubscription.js";

export default class RoomController extends BaseGameController {

  static availableStatesData = {
    update: ["playing"],
    win: ["playing"],
    lose: ["playing"]
  };

  constructor(data) {
    super(data);

    this.onProgressUpdated = this.onProgressUpdated.bind(this);

    this.initEvents();
  }

  initEvents() {
    const {eventDispatcher} = this;

    const callbacksBus = [
      {event: "progress:updated", callback: this.onProgressUpdated}
    ];

    eventSubscription({target: eventDispatcher, callbacksBus});
  }

  init() {
    const {gameSettings: {rooms}} = this;

    rooms.map(prefix => {
      const id = `${prefix}Room`;
      gameFactory.createItem("room", {id, entityId: id});
    });
  }

  initializationSelect() {
    const {stage} = this;

    const rooms = gameFactory.getCollectionByType("room");

    rooms.forEach(({character}) => character.initBehaviour());

    const grid = gameFactory.getItemById("grid", "gameGrid");

    const limitation = gameSize.height - grid.view.height;

    rooms.forEach(room => {
      room.updateLayout(limitation);
      stage.addChild(room.view);
    });

    this.initAim();
  }

  showingSelect() {
    const {tweensSpace} = this;

    const aim = gameFactory.getItemById("aim", "gameAim");

    const prepareAimTimeline = gsap.timeline({
      delay: 0.5
    }).save(tweensSpace, "prepareAim");

    prepareAimTimeline
    .to(aim, {progress: 0.25, ease: "back.inOut(7.5)", duration: 2.25});

    const onComplete = res => {
      aim.isMoved = true;
      prepareAimTimeline.delete(tweensSpace);
      res();
    };

    return new Promise(res => prepareAimTimeline.eventCallback("onComplete", () => onComplete(res)));
  }

  initAim() {
    const {gameSettings: {rooms}} = this;

    const upperRoomId = rooms[rooms.length - 1];

    const upperRoom = gameFactory.getItemById("room", `${upperRoomId}Room`);

    const aim = gameFactory.createItem("aim", {id: "gameAim", target: upperRoom.view});

    aim.isActive = true;

    aim.progress = 0.5;
  }

  onProgressUpdated({progress}) {
    const {state} = this;

    if (RoomController.availableStatesData.lose.includes(state) && progress === 1)
      this.setState("lose");
    else if (RoomController.availableStatesData.win.includes(state) && !progress)
      this.setState("win");
  }

  update(deltaTime) {
    const {state} = this;

    const aim = gameFactory.getItemById("aim", "gameAim");

    if (!RoomController.availableStatesData.update.includes(state)) return;

    aim.update(deltaTime);
  }

  resetSelect() {

  }

  destroy() {

  }
}