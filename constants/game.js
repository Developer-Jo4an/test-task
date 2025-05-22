export const stateMachine = {
  createControllers: {
    availableStates: ["initialization"],
    nextState: "initialization",
    isLoading: true,
    isDefault: true,
    isUpdate: false,
    ignoreNext: false
  },
  initialization: {
    availableStates: ["showing"],
    nextState: "showing",
    isLoading: true,
    isDefault: false,
    isUpdate: false,
    ignoreNext: false
  },
  showing: {
    availableStates: ["playing"],
    nextState: "playing",
    isLoading: false,
    isDefault: false,
    isUpdate: true,
    ignoreNext: false
  },
  playing: {
    availableStates: ["feedback", "win", "lose"],
    nextState: "feedback",
    isLoading: false,
    isDefault: false,
    isUpdate: true,
    ignoreNext: true
  },
  feedback: {
    availableStates: ["playing"],
    nextState: "playing",
    isLoading: false,
    isDefault: false,
    isUpdate: true,
    ignoreNext: false
  },
  win: {
    availableStates: ["reset"],
    nextState: "reset",
    isLoading: false,
    isDefault: false,
    isUpdate: false,
    ignoreNext: true
  },
  lose: {
    availableStates: ["reset"],
    nextState: "reset",
    isLoading: false,
    isDefault: false,
    isUpdate: false,
    ignoreNext: true
  },
  reset: {
    availableStates: ["initialization"],
    nextState: "initialization",
    isLoading: false,
    isDefault: false,
    isUpdate: false,
    ignoreNext: false
  }
};

export const updateStates = Object.entries(stateMachine).map(([key, {isUpdate}]) => isUpdate && key).filter(Boolean);

export const gameSize = {width: 720, height: 1565};

export const gameTweensSpaceId = "game";

export const gameSettings = {
  grid: {
    rows: 6, columns: 7,
    spaceBetween: {x: 8, y: 8},
    padding: 20
  },
  target: {
    count: 3
  },
  rooms: ["light", "dark"],
  stats: {
    target: 3
  }
};

export const assetsData = [
  {path: "textures/stars/star_blue.png", name: "starBlue", storageType: "texture"},
  {path: "textures/stars/star_green.png", name: "starGreen", storageType: "texture"},
  {path: "textures/stars/star_orange.png", name: "starOrange", storageType: "texture"},
  {path: "textures/stars/star_pink.png", name: "starPink", storageType: "texture"},
  {path: "textures/stars/star_purple.png", name: "starPurple", storageType: "texture"},
  {path: "textures/stars/star_red.png", name: "starRed", storageType: "texture"},
  {path: "textures/stars/star_yellow.png", name: "starYellow", storageType: "texture"},

  {path: "textures/cell/cell.png", name: "cell", storageType: "texture"},
  {path: "textures/cell/active-cell.png", name: "activeCell", storageType: "texture"},

  {path: "textures/grid/grid-background.png", name: "gridBackground", storageType: "texture"},
  {path: "textures/grid/grid-background-cap.png", name: "gridBackgroundCap", storageType: "texture"},

  {path: "textures/room/room-dark.png", name: "darkRoom", storageType: "texture"},
  {path: "textures/room/room-light.png", name: "lightRoom", storageType: "texture"},

  {path: "textures/character/character.png", name: "character", storageType: "texture"},
  {path: "textures/character/character-eyelids.png", name: "characterEyelids", storageType: "texture"},
  {path: "textures/character/character-shadow.png", name: "characterShadow", storageType: "texture"},

  {path: "textures/target/pendulum-arrow.png", name: "pendulumArrow", storageType: "texture"},
  {path: "textures/target/pendulum-general.png", name: "pendulumGeneral", storageType: "texture"},
  {path: "textures/target/pendulum-top.png", name: "pendulumTop", storageType: "texture"},

  {path: "sounds/background.mp3", name: "background", storageType: "sound"},
  {path: "sounds/click.mp3", name: "click", storageType: "sound"},
  {path: "sounds/lose.mp3", name: "lose", storageType: "sound"},
  {path: "sounds/win.mp3", name: "win", storageType: "sound"},

  {path: "clips/truth/00.png", name: "truth0", storageType: "texture"},
  {path: "clips/truth/01.png", name: "truth1", storageType: "texture"},
  {path: "clips/truth/02.png", name: "truth2", storageType: "texture"},
  {path: "clips/truth/03.png", name: "truth3", storageType: "texture"},
  {path: "clips/truth/04.png", name: "truth4", storageType: "texture"},
  {path: "clips/truth/05.png", name: "truth5", storageType: "texture"},
  {path: "clips/truth/06.png", name: "truth6", storageType: "texture"},
  {path: "clips/truth/07.png", name: "truth7", storageType: "texture"},
  {path: "clips/truth/08.png", name: "truth8", storageType: "texture"},
  {path: "clips/truth/09.png", name: "truth9", storageType: "texture"},
  {path: "clips/truth/10.png", name: "truth10", storageType: "texture"},
  {path: "clips/truth/11.png", name: "truth11", storageType: "texture"},
  {path: "clips/truth/12.png", name: "truth12", storageType: "texture"},
  {path: "clips/truth/13.png", name: "truth13", storageType: "texture"},
  {path: "clips/truth/14.png", name: "truth14", storageType: "texture"},
  {path: "clips/truth/14.png", name: "truth14", storageType: "texture"},
  {path: "clips/truth/15.png", name: "truth15", storageType: "texture"}
];