const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
const shuffleArray = (array) => array.slice().sort(() => Math.random() - 0.5);
const getRandomArray = (sourceData, maxQuantity = 5) => shuffleArray(sourceData.slice(0, Number(getRandomInteger(1, maxQuantity))));

const onEscKeyDownHandler = (popup) => {
  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      popup.element.remove();
      popup.remove();
      document.removeEventListener('keydown', onEscKeyDownHandler);
    }
  });
};

export {getRandomInteger, getRandomArray, onEscKeyDownHandler};
