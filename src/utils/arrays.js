export const unique = (arr) => {
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  return arr.filter(onlyUnique);
};

export const copy = (source) => {
  var copied = [];
  for (var i = 0; i < source.length; i++) {
    copied[i] = source[i];
  }

  return copied;
};

export const append = (arr, value) => {
  var appended = copy(arr);
  if (value !== null) {
    appended.push(value);
  }

  return appended;
};

export default {
  unique,
};
