import BaseGameFactory from "./BaseGameFactory.js";
import Cell from "../entities/cell/Cell.js";
import Grid from "../entities/grid/Grid.js";
import Star from "../entities/star/Star.js";
import Room from "../entities/room/Room.js";
import Character from "../entities/character/Character.js";

export let gameFactory;

class GameFactory extends BaseGameFactory {
  constructor(data) {
    super(data);
  }

  createCharacter(data) {
    return {props: data, Constructor: Character}
  }

  createRoom(data) {
    return {props: data, Constructor: Room}
  }

  createStar(data) {
    return {props: data, Constructor: Star}
  }

  createGrid(data) {
    return {props: data, Constructor: Grid}
  }

  createCell(data) {
    return {props: data, Constructor: Cell};
  }
}

export const createGameFactory = data => gameFactory ??= new GameFactory(data);


