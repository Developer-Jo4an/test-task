import BaseEntity from "../BaseEntity.js";
import {assetsManager} from "../../../helpers/AssetsManager.js";

export default class Character extends BaseEntity {
  constructor(data) {
    super(data);

    this.init();
  }

  init() {
    this.initViews();
    this.initBehaviour();
  }

  initViews() {
    const view = this.view ??= new PIXI.Container();
    view.sortableChildren = true;

    const shadowTexture = assetsManager.getFromStorage("texture", "characterShadow");
    const shadow = this.shadow ??= new PIXI.Sprite(shadowTexture);
    view.addChild(shadow);

    const characterTexture = assetsManager.getFromStorage("texture", "character");
    const character = this.character ??= new PIXI.Sprite();
    character.texture = characterTexture;
    view.addChild(character);

    const eyelidsTexture = assetsManager.getFromStorage("texture", "characterEyelids");
    const eyes = this.eyes ??= new PIXI.Sprite(eyelidsTexture);
    eyes.alpha = 0;
    view.addChild(eyes);
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
    const {id, tweensSpace} = this;
    gsap.localTimeline.discontinue(tweensSpace, `blink:${id}`);
    super.destroy();
  }
}