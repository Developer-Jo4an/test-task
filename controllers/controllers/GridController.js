import BaseGameController from "./BaseGameController.js";
import {gameSize} from "../../constants/game.js";
import {utils} from "../utils/GameUtils.js";
import {gameFactory} from "../factory/GameFactory.js";
import {getRandomFromArrayAndSlice, shuffleArray} from "../../utils/rand/random.js";
import {eventSubscription} from "../../utils/events/eventSubscription.js";

export default class GridController extends BaseGameController {
  constructor(data) {
    super(data);

    this.onCellSpawn = this.onCellSpawn.bind(this);

    this.initEvents();
  }

  initEvents() {
    const {eventDispatcher} = this;

    const callbacksBus = [
      {event: "cell:spawn", callback: this.onCellSpawn}
    ];

    eventSubscription({target: eventDispatcher, callbacksBus});
  }

  init() {
  }

  initializationSelect() {
    const {stage, gameSettings: {grid: {rows, columns}, target: {count}}, storage: {assetsData}} = this;

    const grid = gameFactory.createItem("grid", {id: "gameGrid"});

    grid.view.position.set(0, gameSize.height);

    stage.addChild(grid.view);

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const {x, y} = this.getCellData(row, column);

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

      const star = gameFactory.createItem("star", {id: `star:${cell.row}-${cell.column}`, entityId: activeStar.name});

      getRandomFromArrayAndSlice(shuffleCells).addItem("star", star);
    });
  }

  showingSelect() {
    const cells = gameFactory.getCollectionByType("cell");

    const shuffledCells = shuffleArray(cells);

    return Promise.all(shuffledCells.map((cell, i) => cell.show({animationExtraProps: {delay: i * 0.05}})));
  }

  getCellData(row, column) {
    const {gameSettings: {grid: {spaceBetween: {x, y}, padding}}} = this;

    const {width, height} = utils.getCellSize();

    return {
      x: (column * width) + (column * x) + (width / 2) + padding,
      y: (-row * height) - (row * y) - (height / 2) - padding
    };
  }

  onCellSpawn({row, column, entityId, onComplete}) {
    const grid = gameFactory.getItemById("grid", "gameGrid");

    const {x, y} = this.getCellData(row, column);

    const cell = gameFactory.createItem("cell", {id: `cell:${row}-${column}`});

    const star = gameFactory.createItem("star", {id: `star:${cell.row}-${cell.column}`, entityId});

    cell.addItem("star", star);

    cell.view.position.set(x, y);

    grid.view.addChild(cell.view);

    cell.show().then(onComplete);
  }

  resetSelect() {

  }

  destroy() {
  }
}