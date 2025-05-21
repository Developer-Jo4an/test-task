import BaseEntity from "../BaseEntity.js";
import {utils} from "../../utils/GameUtils.js";
import {assetsManager} from "../../../helpers/AssetsManager.js";
import {eventSubscription} from "../../../utils/events/eventSubscription.js";
import {gameFactory} from "../../factory/GameFactory.js";

export default class Cell extends BaseEntity {

  items = {};

  _mode;

  constructor(data) {
    super(data);

    this.initProperties(data);
    this.init();
  }

  get mode() {
    return this._mode;
  }

  set mode(mode) {
    if (this.mode === mode)
      throw new Error(`already on ${mode}`);

    if (this.isTransitionMode)
      throw new Error(`isTransitionMode: ${this.mode}`);

    this._mode = mode;

    const {view, background, activeBackground, tweensSpace} = this;

    ({
      active: () => {
        background.visile = false;
        activeBackground.visible = true;

        this.isTransitionMode = true;

        const cells = gameFactory.getCollectionByType("cell");

        const maxZIndex = Math.max(...cells.map(({view: {zIndex}}) => zIndex));

        view.zIndex = maxZIndex + 1;

        const modeChangeTween = gsap.timeline({
          onComplete: () => {
            modeChangeTween.delete(tweensSpace);
            this.isTransitionMode = false;
          }
        }).save(tweensSpace, `${this.id}:${mode}`);

        modeChangeTween.to(view.scale, {x: 1.2, y: 1.2, ease: "sine.out", duration: 0.3});
      },
      static: () => {
        view.zIndex = 0;
        activeBackground.visible = false;
        background.visile = true;
        view.scale.set(1);
      }
    })[mode]?.();
  }

  initProperties(data) {
    this.isTransitionMode = false;
  }

  init() {
    this.initView();
    this.initEvents();
  }

  initView() {
    const view = this.view ??= new PIXI.Container();
    view.interactive = true;

    const backgroundTexture = assetsManager.getFromStorage("texture", "cell");
    const background = this.background ??= new PIXI.Sprite(backgroundTexture);
    this.enterBackground(background);
    view.addChild(background);

    const activeBackgroundTexture = assetsManager.getFromStorage("texture", "activeCell");
    const activeBackground = this.activeBackground ??= new PIXI.Sprite(activeBackgroundTexture);
    this.enterBackground(activeBackground);
    view.addChild(activeBackground);

    this.mode = "static";
  }

  initEvents() {
    const {view} = this;

    const callbacksBus = [
      {
        event: ["click", "tap"], callback: () => {
          this.mode = "active";
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
    const scale = Math.min(width / background.width, height / background.height);
    background.scale.set(scale);
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
    delete this.items[key];
  }

  destroy() {
    const {tweensSpace, items, view} = this;

    for (const key in items) {
      const entity = this.items[key];
      entity?.destroy?.();
      this.removeItem(key);
      view.removeChild(entity.view);
    }

    this.items = {};

    ["active", "static"].forEach(mode => {
      gsap.localTimeline.discontinue(tweensSpace, `${this.id}:${mode}`);
    });

    super.destroy();
  }
}