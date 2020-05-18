export const isNull = (obj) => {
  return obj === null || typeof obj === 'undefined';
};

export const isDataFrame = (x) => {
  return typeof x['class'] !== undefined && x['class'] === 'dataframe';
};
