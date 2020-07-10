import * as checks from './checks';

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

export const dfFromColumns = (cols) => {
  return cols[0].map((row, idx) => {
    var row = {};
    for (var col in cols) {
      row[cols[col]] = cols[col][idx];
    }
    return row;
  });
};

export const dfCBind = (df1, df2) => {
  var rows = df1.map((left, idx) => {
    var row = {};
    Object.assign(row, left);
    Object.assign(row, df2[idx]);
    return row;
  });
  var cols = Object.assign(dfColNames(df1), dfColNames(df1));

  return dataFrame(rows, cols);
};
