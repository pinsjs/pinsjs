export function isNull(obj) {
  return obj === null || typeof obj === 'undefined';
}

export function isDataFrame(x) {
  return typeof x['class'] !== undefined && x['class'] === 'dataframe';
}
