function shuffle(array) {
  let m = array.length,
    t,
    i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function replenishShapeBag() {
  return shuffle("ITOLSZJ".split(""));
}

function randomType() {
  const type = shapeBag.shift();
  if (shapeBag.length < 7) {
    shapeBag = shapeBag.concat(replenishShapeBag());
  }
  return type;
}
