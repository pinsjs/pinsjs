import mime from 'mime';

// TODO cbind()
// TODO remove(column)
// TODO order((e) => ())

export const dataFrame = (data, columns) => {
  var df = [];
  if (!checks.isNull(data)) {
    df = data;
  }

  df.columns = columns;
  return df;
};

export const dfColNames = (df) => {
  if (df.hasOwnProperty('columns')) return Object.keys(df['columns']);
  if (df.length > 0) return Object.keys(df[0]);
  return [];
};
