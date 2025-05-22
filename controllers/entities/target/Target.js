import BaseEntity from "../BaseEntity.js";
import {upperFirst} from "../../../utils/text/format.js";
import {assetsManager} from "../../../helpers/AssetsManager.js";
import {gameFactory} from "../../factory/GameFactory.js";
import {shuffleArray} from "../../../utils/rand/random.js";

export default class Target extends BaseEntity {

  static parts = ["top", "general", "arrow"];

  _target;

  parts = {};

  constructor(data) {
    super(data);

    this.initProperties(data);
    this.init();
  }

  get target() {
    return this._target;
  }

  set target(target) {
    const {parts: {general}} = this;

    if (typeof target !== "string") {
      general.removeChild(this.targetView);
      return;
    }

    const texture = assetsManager.getFromStorage("texture", target);

    const targetView = this.targetView ??= new PIXI.Sprite();

    targetView.texture = texture;
    targetView.anchor.set(0.5);
    targetView.scale.set(1);
    targetView.scale.set(Math.min(general.width * 0.8 / targetView.width, general.height * 0.8 / targetView.height));
    targetView.entityId = target;

    general.addChild(targetView);

    this._target = targetView;

    this.showTarget();
  }

  initProperties(data) {
    this.trackable = data.trackable;
    this.getTrackableBounds = data.getTrackableBounds;
  }

  init() {
    const {trackable: {height}} = this;

    const view = this.view ??= new PIXI.Container();

    view.scale.set(1);

    Target.parts.forEach(part => {
      const texture = assetsManager.getFromStorage("texture", `pendulum${upperFirst(part)}`);

      const partView = this.parts[part] ??= new PIXI.Sprite(texture);

      ({
        top: () => {
          partView.anchor.set(0.5, 0);
        },
        general: () => {
          const {top} = this.parts;
          partView.anchor.set(0.5);
          partView.position.set(0, top.y + top.height + partView.height / 2);
        },
        arrow: () => {
          const {general} = this.parts;
          partView.anchor.set(0.5, 0);
          partView.position.set(0, general.y + general.height / 2);
        }
      })[part]?.();

      view.addChild(partView);
    });

    view.scale.set(height / view.height);

    this.updateTarget();
  }

  updateTarget() {
    const stars = gameFactory.getCollectionByType("star");

    const starsStats = stars.reduce((acc, star) => {
      const {entityId} = star;

      if (!acc.hasOwnProperty(entityId))
        acc[entityId] = 0;

      acc[entityId]++;

      return acc;
    }, {});

    const {entityId} = shuffleArray(Object.entries(starsStats)).reduce((acc, [key, value]) => {
      if (value > acc.count)
        acc = {entityId: key, count: value};
      return acc;
    }, {entityId: null, count: -Infinity});

    this.target = entityId;
  }

  showTarget() {
    const {target, tweensSpace} = this;

    const initialScale = {x: target.scale.x, y: target.scale.y};

    target.alpha = 0;
    target.scale.set(initialScale.x / 2, initialScale.y / 2);

    gsap.localTimeline.discontinue(tweensSpace, "showTarget", true, true);

    const showTimeline = gsap.timeline({
      onComplete: () => {
        showTimeline.delete(tweensSpace);
      }
    }).save(tweensSpace, "showTarget");

    showTimeline
    .to(target, {alpha: 1, ease: "sine.inOut", duration: 0.6})
    .to(target.scale, {x: initialScale.x, y: initialScale.y, ease: "back.out(2)", duration: 0.6}, 0);
  }

  update() {
    const {view, getTrackableBounds} = this;

    const {x} = getTrackableBounds();

    view.x = x;
  }

  reset(data) {
    super.reset(data);
    this.initProperties(data);
    this.init();
  }

  destroy() {
    this.target = null;

    super.destroy();
  }
}