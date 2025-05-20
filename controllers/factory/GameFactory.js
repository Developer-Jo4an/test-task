import BaseGameFactory from "./BaseGameFactory.js";
import Cell from "../entities/cell/Cell.js";

export let gameFactory;

class GameFactory extends BaseGameFactory {
  constructor(data) {
    super(data);
  }

  createCell(data) {
    return {props: data, Constructor: Cell};
  }
}

export const createGameFactory = data => gameFactory ??= new GameFactory(data);


