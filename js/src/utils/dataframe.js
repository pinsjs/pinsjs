import * as checks from './checks';

export function dataFrame(data, columns) {
  var df = [];

  if (!checks.isNull(data)) {
    df = data;
  }

  df.columns = columns;
  return df;
}

export function dfColNames(df) {
  if (df.hasOwnProperty('columns')) return Object.keys(df['columns']);
  if (df.length > 0) return Object.keys(df[0]);
  return [];
}

export function dfFromColumns(cols) {
  return cols[0].map((row, idx) => {
    var row = {};
    for (var col in cols) {
      row[cols[col]] = cols[col][idx];
    }
    return row;
  });
}

export function dfCBind(df1, df2) {
  var rows = df1.map((left, idx) => {
    var row = {};
    Object.assign(row, left);
    Object.assign(row, df2[idx]);
    return row;
  });

  var cols = Object.assign({}, df1.columns);
  Object.assign(cols, df2.columns);

  return dataFrame(rows, cols);
}

export function dfColRemove(df, col) {
  var cols = {};
  Object.assign(cols, df.columns);
  if (Object.keys(cols).includes(col)) delete cols[col];

  var rows = df.map((old) => {
    var row = {};
    Object.assign(row, old);
    if (Object.keys(row).includes(col)) delete row[col];
    return row;
  });

  return dataFrame(rows, cols);
}

export function dfIsDataFrame(obj) {
  if (Array.isArray(obj)) {
    if (obj.length === 0 || typeof obj.columns != 'undefined') return true;

    if (obj.length === 1 && typeof obj[0] === 'object') {
      return true;
    }

    if (obj.length > 1) {
      var isDataFrame = true;
      for (var idxRow = 1; idxRow < obj.length; idxRow++) {
        if (
          typeof obj[idxRow] !== 'object' ||
          obj[idxRow].length !== obj[0].length
        ) {
          isDataFrame = false;
          break;
        }
      }

      return isDataFrame;
    }
  }

  return false;
}
