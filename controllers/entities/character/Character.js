import BaseEntity from "../BaseEntity.js";
import {assetsManager} from "../../../helpers/AssetsManager.js";

export default class Character extends BaseEntity {
  constructor(data) {
    super(data);

    this.init();
  }

  init() {
    this.initViews();
  }

  initViews() {
    const view = this.view ??= new PIXI.Container();
    view.sortableChildren = true;

    const characterTexture = assetsManager.getFromStorage("texture", "character");
    const character = this.character ??= new PIXI.Sprite();
    character.name = "character";
    character.texture = characterTexture;

    const shadowTexture = assetsManager.getFromStorage("texture", "characterShadow");
    const shadow = this.shadow ??= new PIXI.Sprite(shadowTexture);
    shadow.name = "characterShadow";

    const eyelidsTexture = assetsManager.getFromStorage("texture", "characterEyelids");
    const eyes = this.eyes ??= new PIXI.Sprite(eyelidsTexture);
    eyes.name = "characterEyes";
    eyes.alpha = 0;

    view.addChild(shadow);
    view.addChild(eyes);
    view.addChild(character);
  }

  initBehaviour() {
    const {eyes, tweensSpace, id} = this;

    const blinkTimeline = gsap.timeline({
      repeat: -1,
      onComplete: () => {
        blinkTimeline.delete(tweensSpace);
      }
    }).save(tweensSpace, `blink:${id}`);

    blinkTimeline
    .to(eyes, {alpha: 1, ease: "sine.inOut", duration: 0.15})
    .set(eyes, {alpha: 0})
    .to(eyes, {delay: 3});
  }

  destroy() {
    super.destroy();
  }
}