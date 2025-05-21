export const stateMachine = {
  createControllers: {
    availableStates: ["initialization"],
    nextState: "initialization",
    isLoading: true,
    isDefault: true,
    ignoreNext: false
  },
  initialization: {
    availableStates: ["playing"],
    nextState: "playing",
    isLoading: true,
    isDefault: false,
    ignoreNext: false
  },
  playing: {
    availableStates: [],
    nextState: "",
    isLoading: false,
    isDefault: false,
    ignoreNext: true
  }
};

export const gameSize = {width: 720, height: 1565};

export const gameTweensSpaceId = "game";

export const gameSettings = {
  grid: {
    rows: 6, columns: 7
  },
  target: {
    count: 3
  }
};

export const assetsData = [
  {path: "stars/star_blue.png", name: "starBlue", storageType: "texture"},
  {path: "stars/star_green.png", name: "starGreen", storageType: "texture"},
  {path: "stars/star_orange.png", name: "starOrange", storageType: "texture"},
  {path: "stars/star_pink.png", name: "starPink", storageType: "texture"},
  {path: "stars/star_purple.png", name: "starPurple", storageType: "texture"},
  {path: "stars/star_red.png", name: "starRed", storageType: "texture"},
  {path: "stars/star_yellow.png", name: "starYellow", storageType: "texture"},

  {path: "cell/cell.png", name: "cell", storageType: "texture"},
  {path: "cell/active-cell.png", name: "activeCell", storageType: "texture"},

  {path: "grid/grid-background.png", name: "gridBackground", storageType: "texture"},
  {path: "grid/grid-background-cap.png", name: "gridBackgroundCap", storageType: "texture"},

  {path: "room/room-dark.png", name: "darkRoom", storageType: "texture"},
  {path: "room/room-light.png", name: "lightRoom", storageType: "texture"},

  {path: "character/character.png", name: "character", storageType: "texture"},
  {path: "character/character-eyelids.png", name: "characterEyelids", storageType: "texture"},
  {path: "character/character-shadow.png", name: "characterShadow", storageType: "texture"}
];