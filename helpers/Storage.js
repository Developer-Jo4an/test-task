import {upperFirst} from "../utils/text/format.js";
import {assetsManager} from "./AssetsManager.js";

export default class Storage {

  static assetsPrefix = "./assets/";

  constructor({assetsData}) {
    this.assetsData = assetsData;
  }

  load() {
    const {assetsData} = this;

    const sortedAssets = assetsData.reduce((acc, {path, name, storageType, params = {}}) => {
      if (!acc[storageType]) acc[storageType] = {};
      acc[storageType][name] = `${Storage.assetsPrefix}${path}`;
      return acc;
    }, {});

    return Promise.all(Object.entries(sortedAssets).map(([key, value]) => {
      const loadMethod = this[`load${upperFirst(key)}s`];
      return loadMethod.call(this, value);
    }));
  }

  async loadTextures(textures) {
    const formattedArray = Object.values(textures).map(path => path);

    const loadedResources = await PIXI.Assets.load(formattedArray);

    for (const key in textures) {
      const texturePath = textures[key];
      const textureInstance = loadedResources[texturePath];
      assetsManager.addToStorage("texture", key, textureInstance);
    }
  }

  loadSounds(sounds) {
    return Promise.all(Object.entries(sounds).map(([key, value]) => {
      const sound = new Howl({src: [value], volume: 0.5});
      assetsManager.addToStorage("sound", key, sound);
    }));
  }
}