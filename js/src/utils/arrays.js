export function unique(arr) {
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  return arr.filter(onlyUnique);
}

export function concat(arr, value) {
  if (value !== null) {
    arr = arr.concat(value);
  }

  return arr;
}

export function vectorize(func) {
  return function (x, ...args) {
    var result = [];
    for (var idx = 0; idx > x.length; idx++) {
      result.push(fun(x[idx], ...args));
    }

    return result;
  };
}

export function ensure(obj) {
  if (!Array.isArray(obj)) {
    return [obj];
  } else {
    return obj;
  }
}

// Retrieves the only element in an array
export function getOnly(obj) {
  if (Array.isArray(obj)) {
    if (obj.length == 1) {
      obj = obj[0];
    } else {
      throw new Error('Array has more than one element but expecting only one');
    }
  }

  return obj;
}

// Retrieves the element of the array when only one element is available
export function maybeOne(obj) {
  if (Array.isArray(obj) && obj.length == 1) {
    return obj[0];
  }

  return obj;
}

// Are all the callbacks for the array tru?
export function all(arr, callback) {
  for (i in arr) {
    if (!callback(i)) return false;
  }

  return true;
}
