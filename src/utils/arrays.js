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
