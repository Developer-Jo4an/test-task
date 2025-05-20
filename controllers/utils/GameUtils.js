import BaseUtils from "./BaseUtils.js";
import {gameSize} from "../../constants/game.js";

export let utils;

class GameUtils extends BaseUtils {
  constructor(data) {
    super(data);
  }

  getCellSize() {
    const {gameSettings: {grid: {columns}}} = this;

    const width = gameSize.width / columns, height = gameSize.width / columns;

    return {width, height};
  }
}

export const createUtils = data => utils ??= new GameUtils(data);