import map from "../resources/map";

const fileMapGenerator = () => map;

const getRandomGarbage = () =>
  Math.floor(Math.random() * 3 + 1) === 1 ? true : false;

const getGarbageMap = gameMap =>
  gameMap.map(gameRow =>
    gameRow.map(
      element => (element.FieldType === "house" ? getRandomGarbage() : false)
    )
  );

export default {
  fileMapGenerator,
  getGarbageMap
};
