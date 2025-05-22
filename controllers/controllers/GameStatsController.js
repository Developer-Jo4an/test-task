import BaseGameController from "./BaseGameController.js";
import {eventSubscription} from "../../utils/events/eventSubscription.js";
import {gameFactory} from "../factory/GameFactory.js";
import {updateStates} from "../../constants/game.js";

export default class GameStatsController extends BaseGameController {

  constructor(data) {
    super(data);

    this.onCellUpdated = this.onCellUpdated.bind(this);

    this.initEvents();
  }

  initEvents() {
    const {eventDispatcher} = this;

    const callbacksBus = [
      {event: "cell:mode-changed", callback: this.onCellUpdated}
    ];

    eventSubscription({target: eventDispatcher, callbacksBus});
  }

  init() {
  }

  initializationSelect() {
    const {stage} = this;

    this.activeCells = [];

    const aim = gameFactory.getItemById("aim", "gameAim");

    const target = gameFactory.createItem("target", {
      id: "gameTarget", trackable: aim.view, getTrackableBounds: () => ({
        x: aim.view.width, // Это не опечатка
        y: aim.view.y,
        width: aim.view.width,
        height: aim.view.height
      })
    });

    stage.addChild(target.view);
  }

  async feedbackSelect(transitionTween) {
    const {activeCells, eventDispatcher, tweensSpace} = this;

    const gameTarget = gameFactory.getItemById("target", "gameTarget");

    const {target} = gameTarget;

    const cells = gameFactory.getCollectionByType("cell");

    if (activeCells.some(({items: {star: {entityId} = {}}}) => entityId !== target.entityId)) {
      cells.forEach(cell => cell.mode = !activeCells.includes(cell) ? "static" : "mistake");
      this.activeCells = [];
      eventDispatcher.dispatchEvent({type: "feedback:update", feedbackType: "wrong"});
      return;
    }

    const targetGlobalPosition = target.getGlobalPosition();


    const entitiesIds = await Promise.all(activeCells.map((cell, index, {length}) => {
      const {view: cellView, id: cellId} = cell;

      const targetLocalPosition = cellView.parent.toLocal(targetGlobalPosition);

      const offsetX = targetLocalPosition.x - cellView.x;
      const offsetY = targetLocalPosition.y - cellView.y;

      const isRight = Number(cellView.getGlobalPosition().x < globalThis.innerWidth / 2);

      const start = {x: cellView.x, y: cellView.y};
      const end = {x: cellView.x + offsetX, y: cellView.y + offsetY};
      const middle = {x: start.x + (isRight ? 1 : -1) * 200, y: start.y - 200};

      const flyTimeline = gsap.timeline({
        delay: index * 0.1
      }).save(tweensSpace, `fly:${cellId}`);

      flyTimeline
      .to(cellView, {
        duration: 0.5,
        motionPath: {path: [start, middle, end], curviness: 2, autoRotate: false},
        ease: "sine.inOut"
      })
      .to(cellView.scale, {x: 0, y: 0, duration: 0.25, ease: "sine.inOut"}, 0.25)
      .to(cellView, {alpha: 0, duration: 0.25, ease: "sine.inOut"}, 0.25);

      const onComplete = res => {
        const {items: {star: {entityId}}} = cell;

        cell.destroy();

        !index && gameTarget.updateTarget();

        flyTimeline.delete(tweensSpace);

        gameTarget.truth();

        res(entityId);
      };

      return new Promise(res => flyTimeline.eventCallback("onComplete", () => onComplete(res)));
    }));

    const showTweens = activeCells.map((cell, index) => new Promise(res => {
      const {row, column} = cell;

      const showTween = gsap.to({}, {
        delay: 0.01 * index,
        onComplete: () => {
          eventDispatcher.dispatchEvent({
            type: "cell:spawn", entityId: entitiesIds[index], row, column, onComplete: res
          });

          showTween.delete(tweensSpace);
        }
      }).save(tweensSpace);
    }));

    await Promise.all(showTweens);

    this.activeCells = [];

    return () => new Promise(res => {
      eventDispatcher.dispatchEvent({type: "feedback:update", feedbackType: "truth", onComplete: res});
    });
  }

  onCellUpdated({cell}) {
    const {activeCells} = this;

    const {mode, items: {star}} = cell;

    const cells = gameFactory.getCollectionByType("cell");

    ({
      active: () => {
        const {entityId} = star;

        if (activeCells.every(({items: {star: {entityId: activeCellId} = {}}}) => activeCellId === entityId))
          this.activeCells.push(cell);
        else {
          cells.forEach(currentCell => currentCell !== cell && currentCell.mode === "active" && (currentCell.mode = "static"));
          this.activeCells = [cell];
        }

        this.onUpdateActiveCells();
      }
    })[mode]?.();
  }

  onUpdateActiveCells() {
    const {activeCells, gameSettings: {stats: {target}}} = this;

    const cells = gameFactory.getCollectionByType("cell");

    if (activeCells?.length === target) {
      cells.forEach(cell => !activeCells.includes(cell) && (cell.mode = "static"));
      this.setState("feedback");
    }
  }

  update() {
    if (!updateStates.includes(this.state)) return;

    const target = gameFactory.getItemById("target", "gameTarget");

    target.update();
  }

  resetSelect() {
    this.activeCells = [];
  }

  destroy() {
    this.activeCells = [];
  }
}