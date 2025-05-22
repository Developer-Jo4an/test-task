import BaseUtils from "./BaseUtils.js";
import {gameSize} from "../../constants/game.js";

export let utils;

class GameUtils extends BaseUtils {
  constructor(data) {
    super(data);
  }

  getCellSize() {
    const {gameSettings: {grid: {columns, spaceBetween: {x}, padding}}} = this;

    const freeHorizontal = gameSize.width - (x * (columns - 1)) - (padding * 2);

    const width = freeHorizontal / columns;
    const height = freeHorizontal / columns;

    return {width, height};
  }
}

export const createUtils = data => utils ??= new GameUtils(data);