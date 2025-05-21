export function rand(min, max) {
  if (arguments.length === 1) {
    max = min;
    min = 0;
  }

  return mix(min, max, Math.random());
}

export function randInteger(min, max) {
  return rand.apply(this, arguments) | 0;
}

export function randFromArray(arr) {
  return arr[randInteger(arr.length)];
}

export function randFromWeightedArray(arr) {
  const {total, map} = arr.reduce(initWeights, {total: 0, map: []});

  if (total === 0) {
    return randFromArray(arr);
  }

  const r = rand(total);
  let i = 0;
  while (r >= map[i]) {
    i++;
  }
  return arr[i];

  function initWeights(res, {weight}) {
    res.map.push((res.total += weight));
    return res;
  }
}

export function shuffleArray(arr) {
  const src = [...arr];
  const dst = [];
  while (src.length) {
    dst.push(src.splice(randInteger(src.length), 1)[0]);
  }
  return dst;
}


/**
 * Находит число между `v1` и `v2`
 * @param v1 {number}
 * @param v2 {number}
 * @param val {number}
 * @return {*}
 */
export function mix(v1, v2, val) {
  return v1 + (v2 - v1) * val;
}

export function getRandomFromArrayAndSlice(arr) {
  return arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
}
