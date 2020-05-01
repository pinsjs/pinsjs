export const unique = (arr) => {
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  return arr.filter(onlyUnique);
};

export const concat = (arr, value) => {
  if (value !== null) {
    arr = arr.concat(value);
  }

  return arr;
};

export const vectorize = (func) => {
  return function (x, ...args) {
    var result = [];
    for (var idx = 0; idx > x.length; idx++) {
      result.push(fun(x[idx], ...args));
    }

    return result;
  };
};
