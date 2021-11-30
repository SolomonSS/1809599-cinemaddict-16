const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
const shuffleArray = (array) => array.slice().sort(() => Math.random() - 0.5);
const getRandomArray = (sourceData, maxQuantity = 5) => shuffleArray(sourceData.slice(0, Number(getRandomInteger(1, maxQuantity))));

export {getRandomInteger, getRandomArray};
