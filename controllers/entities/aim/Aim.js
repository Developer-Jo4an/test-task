import BaseEntity from "../BaseEntity.js";
import {gameSize} from "../../../constants/game.js";
import {minmax} from "../../../utils/rand/random.js";
import {eventSubscription} from "../../../utils/events/eventSubscription.js";

export default class Aim extends BaseEntity {

  _progress = 0;

  _isActive = false;

  constructor(data) {
    super(data);

    this.onFeedbackUpdate = this.onFeedbackUpdate.bind(this);

    this.initEvents();
    this.initProperties(data);
    this.init();
  }

  get isActive() {
    return this._isActive;
  }

  set isActive(isActive) {
    const {view, stage} = this;

    if (this.isActive === isActive) return;

    this._isActive = isActive;

    stage[isActive ? "addChild" : "removeChild"](view);

    this.progress = 0;

    this.isMoved = false;
  }

  get progress() {
    return this._progress;
  }

  set progress(progress) {
    const {view, eventDispatcher, target: {height}} = this;

    const newProgress = this._progress = minmax(progress, 0, 1);

    view.clear().beginFill(0xFFFFFF).drawRect(0, 0, gameSize.width * newProgress, height).endFill();

    eventDispatcher.dispatchEvent({type: "progress:updated", progress: newProgress});
  }

  initEvents() {
    const {eventDispatcher} = this;

    const callbacksBus = [
      {event: "feedback:update", callback: this.onFeedbackUpdate}
    ];

    eventSubscription({target: eventDispatcher, callbacksBus});
  }

  initProperties(data) {
    this.target = data.target;
    this.isMoved = false;
  }

  init() {
    const {target} = this;

    const view = this.view ??= new PIXI.Graphics();

    target.mask = view;
  }

  onFeedbackUpdate({feedbackType, onComplete}) {
    const {progress, tweensSpace} = this;

    ({
      truth: () => {
        const progressTween = gsap.to(this, {
          progress: progress - 0.2, ease: "sine.inOut", duration: 0.5,
          onComplete: () => {
            progressTween.delete(tweensSpace);
            onComplete?.();
          }
        }).save(tweensSpace, "aimProgressTween");
      },
      wrong: () => onComplete?.()
    })[feedbackType]?.();
  }

  stopTweens() {
    const {tweensSpace} = this;

    ["aimProgressTween"].forEach(tweenId => {
      gsap.localTimeline.discontinue(tweensSpace, tweenId);
    });
  }

  update(deltaTime) {
    const {isActive, isMoved} = this;

    if (!isActive || !isMoved) return;

    this.progress += deltaTime / 1000;
  }

  reset(data) {
    super.reset(data);
    this.initProperties(data);
    this.init();
  }

  destroy() {
    this.isActive = false;

    this.stopTweens();

    super.destroy();
  }
}