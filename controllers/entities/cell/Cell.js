import BaseEntity from "../BaseEntity.js";
import {utils} from "../../utils/GameUtils.js";
import {assetsManager} from "../../../helpers/AssetsManager.js";
import {eventSubscription} from "../../../utils/events/eventSubscription.js";
import {gameFactory} from "../../factory/GameFactory.js";

export default class Cell extends BaseEntity {

  static interactiveStates = ["playing"];

  items = {};

  _mode;

  constructor(data) {
    super(data);

    this.initProperties(data);
    this.init();
  }

  get row() {
    const {id} = this;

    const [row] = id.split(":")[1].split("-");

    return row;
  }

  get column() {
    const {id} = this;

    const [, column] = id.split(":")[1].split("-");

    return column;
  }

  get mode() {
    return this._mode;
  }

  set mode(mode) {
    const {view, id, background, activeBackground, tweensSpace, eventDispatcher, isTransition} = this;

    if (this.mode === mode || isTransition) return;

    this._mode = mode;

    this.stopModeTransition();

    ({
      active: () => new Promise(res => {
        background.visile = false;

        activeBackground.visible = true;

        activeBackground.alpha = 0;

        const cells = gameFactory.getCollectionByType("cell");

        const maxZIndex = Math.max(...cells.map(({view: {zIndex}}) => zIndex));

        view.zIndex = maxZIndex + 1;

        const modeChangeTween = gsap.timeline({
          onComplete: () => {
            modeChangeTween.delete(tweensSpace);
            res({mode});
          }
        }).save(tweensSpace, `${id}:${mode}`);

        modeChangeTween
        .to(view.scale, {x: 1.2, y: 1.2, ease: "sine.out", duration: 0.3})
        .to(activeBackground, {alpha: 1, ease: "sine.out", duration: 0.3}, 0);
      }),
      static: () => new Promise(res => {
        const modeChangeTween = gsap.timeline({
          onComplete: () => {
            activeBackground.visible = false;

            background.visile = true;

            view.zIndex = 0;

            modeChangeTween.delete(tweensSpace);

            res({mode});
          }
        }).save(tweensSpace, `${id}:${mode}`);

        modeChangeTween
        .to(view.scale, {x: 1, y: 1, ease: "sine.out", duration: 0.3})
        .to(activeBackground, {alpha: 0, ease: "sine.out", duration: 0.3}, 0);
      }),
      mistake: () => new Promise(res => {
        activeBackground.visible = false;

        background.visile = true;

        const modeChangeTween = gsap.timeline({
          onComplete: () => {
            view.zIndex = 0;

            modeChangeTween.delete(tweensSpace);

            res({mode});
          }
        }).save(tweensSpace, `${id}:${mode}`);

        background.tint = 0xff0000;

        modeChangeTween
        .to(view.scale, {x: 1, y: 1, ease: "sine.out", duration: 0.3})
        .to(background, {tint: 0xffffff, ease: "sine.out", duration: 0.3});
      })
    })[mode]?.().then(({mode} = {}) => eventDispatcher.dispatchEvent({type: "cell:mode-changed", cell: this}));
  }

  initProperties(data) {
    this.isTransition = false;
  }

  init() {
    this.initView();
    this.initEvents();
  }

  initView() {
    const view = this.view ??= new PIXI.Container();
    view.alpha = 1;
    view.scale.set(1);
    view.interactive = true;
    view.zIndex = 0;

    const backgroundTexture = assetsManager.getFromStorage("texture", "cell");
    const background = this.background ??= new PIXI.Sprite(backgroundTexture);
    background.alpha = 1;
    background.tint = 0xffffff;
    background.visible = true;
    this.enterBackground(background);
    view.addChild(background);

    const activeBackgroundTexture = assetsManager.getFromStorage("texture", "activeCell");
    const activeBackground = this.activeBackground ??= new PIXI.Sprite(activeBackgroundTexture);
    activeBackground.alpha = 1;
    activeBackground.tint = 0xffffff;
    activeBackground.visible = false;
    this.enterBackground(activeBackground);
    view.addChild(activeBackground);

    this.mode = "static";
  }

  initEvents() {
    const {view} = this;

    const callbacksBus = [
      {
        event: ["click", "tap"], callback: () => {
          Cell.interactiveStates.includes(this.state) && (this.mode = "active");
        }
      }
    ];

    this.rememberListeners(eventSubscription({
      callbacksBus, target: view, postfix: "", actionAdd: "on", actionRemove: "off"
    }));
  }

  enterBackground(background) {
    const {width, height} = utils.getCellSize();

    background.scale.set(1);
    background.scale.set(width / background.width, height / background.height);
    background.anchor.set(0.5);
  }

  addItem(id, item) {
    const {view} = this;

    const {width, height} = view;

    this.items[id] = item;

    const scale = Math.min(width / item.view.width, height / item.view.height);
    item.view.scale.set(scale);
    item.parentCell = this;
    view.addChild(item.view);
  }

  removeItem(key) {
    this.items[key].parentCell = null;
    delete this.items[key];
  }

  stopModeTransition() {
    const {tweensSpace, id} = this;

    ["active", "static", "mistake"].forEach(mode => {
      gsap.localTimeline.discontinue(tweensSpace, `${id}:${mode}`);
    });
  }

  stopVisibilityTweens() {
    const {tweensSpace, id} = this;

    ["show", "hide"].forEach(tweenId => {
      gsap.localTimeline.discontinue(tweensSpace, `${tweenId}Cell${id}`);
    });
  }

  show({animationExtraProps = {}} = {}) {
    const {view, isTransition, tweensSpace, id} = this;

    if (isTransition) return;

    this.isTransition = true;

    const showTimeline = gsap.timeline({...animationExtraProps}).save(tweensSpace, `showCell${id}`);

    const initialScale = {x: view.scale.x, y: view.scale.y};

    view.alpha = 0;
    view.scale.set(initialScale.x / 2, initialScale.y / 2);

    showTimeline
    .to(view, {alpha: 1, ease: "sine.inOut", duration: 0.3})
    .to(view.scale, {x: initialScale.x, y: initialScale.y, ease: "back.out(7.5)", duration: 0.3}, 0);

    const onComplete = res => {
      this.isTransition = false;
      showTimeline.delete(tweensSpace);
      res();
    };

    return new Promise(res => showTimeline.eventCallback("onComplete", () => onComplete(res)));
  }

  reset(data) {
    super.reset(data);
    this.initProperties(data);
    this.init();
  }

  destroy() {
    const {items, view} = this;

    for (const key in items) {
      const entity = this.items[key];
      entity?.destroy?.();
      this.removeItem(key);
      view.removeChild(entity.view);
    }

    this.items = {};

    this.stopModeTransition();
    this.stopVisibilityTweens();

    view.parent.removeChild(view);

    super.destroy();
  }
}