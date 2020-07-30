export const dictRemove = (dict, removes) => {
  var copy = {};
  Object.assign(copy, dict);
  removes.forEach((remove) => {
    if (copy.hasOwnProperty(remove)) delete copy[remove];
  });
  return copy;
};
