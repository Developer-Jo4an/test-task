import BaseGameController from "./BaseGameController.js";
import {assetsData, gameSettings, gameSize} from "../../constants/game.js";
import {utils} from "../utils/GameUtils.js";
import {gameFactory} from "../factory/GameFactory.js";
import {getRandomFromArrayAndSlice, shuffleArray} from "../../utils/rand/random.js";

export default class GridController extends BaseGameController {
  constructor(data) {
    super(data);
  }

  init() {
    const {stage} = this;

    const grid = gameFactory.createItem("grid", {id: "gameGrid"});

    grid.view.position.set(0, gameSize.height);

    stage.addChild(grid.view);
  }

  initializationSelect() {
    const {grid: {rows, columns}, target: {count}} = gameSettings;

    const grid = gameFactory.getItemById("grid", "gameGrid");

    const {width, height} = utils.getCellSize();

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const x = column * width + width / 2;
        const y = -row * height - height / 2;
        const cell = gameFactory.createItem("cell", {id: `cell:${row}-${column}`});
        cell.view.position.set(x, y);
        grid.view.addChild(cell.view);
      }
    }

    grid.setBackground();

    const allCells = gameFactory.getCollectionByType("cell");
    const shuffleCells = shuffleArray(allCells);

    const allStars = assetsData.filter(({name}) => name.startsWith("star"));
    let activeArr = [...allStars];

    let activeStar;

    allCells.forEach((cell, i) => {
      if (!activeArr.length)
        activeArr = [...allStars];

      if (!(i % count))
        activeStar = getRandomFromArrayAndSlice(activeArr);

      const star = gameFactory.createItem("star", {id: `star:${i}`, entityId: activeStar.name});

      getRandomFromArrayAndSlice(shuffleCells).addItem("star", star);
    });
  }
}