class AssetsManager {

  storages = {};

  addStorage(storageType) {
    if (this.storages[storageType])
      throw new Error("already exist");

    this.storages[storageType] = {};
  }

  removeStorage(storageType) {
    if (!this.storages[storageType])
      throw new Error("storage doesn't exist");

    delete this.storages[storageType];
  }

  addToStorage(storageType, id, item) {
    if (this.storages[storageType]?.[id])
      throw new Error("already exist");

    const currentStorage = this.storages[storageType] ??= {};

    currentStorage[id] = item;
  }

  getFromStorage(storageType, id) {
    if (!this.storages[storageType]?.[id])
      throw new Error("storage or item doesn't exist");

    return this.storages[storageType][id];
  }

  removeFromStorage(storageType, id) {
    if (!this.storages[storageType]?.[id])
      throw new Error("storage or item doesn't exist");

    delete this.storages[storageType][id];
  }
}

export const assetsManager = new AssetsManager();