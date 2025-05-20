import BaseGameController from "./BaseGameController.js";
import {gameSettings} from "../../constants/game.js";
import {utils} from "../utils/GameUtils.js";

export default class GridController extends BaseGameController {
  constructor(data) {
    super(data);
  }

  init() {
    const {grid: {rows, columns}} = gameSettings;

    const {width, height} = utils.getCellSize();

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const x = column * width + width / 2;
        const y = -row * height - height / 2;
        console.log(x, y);
      }
    }
  }
}