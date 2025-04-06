export default function shuffleArray(items) {
  let originArray = [...items]
  function compareRandom() {
    return Math.random() - 0.5;
  }
  originArray.sort(compareRandom);
  return originArray;
}