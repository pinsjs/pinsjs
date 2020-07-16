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

export const ensure = (obj) => {
  if (!Array.isArray(obj)) {
    return [obj];
  } else {
    return obj;
  }
};

// Retrieves the only element in an array
export const getOnly = (obj) => {
  if (Array.isArray(obj)) {
    if (obj.length == 1) {
      obj = obj[0];
    } else {
      throw new Exception(
        'Array has more than one element but expecting only one'
      );
    }
  }

  return obj;
};

// Retrieves the element of the array when only one element is available
export const maybeOne = (obj) => {
  if (Array.isArray(obj) && obj.length == 1) {
    return obj[0];
  }

  return obj;
};
