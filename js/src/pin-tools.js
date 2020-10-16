import * as checks from './utils/checks';
import * as fileSystem from './host/file-system';
import { dictRemove } from './utils/dict';
import { dataFrame } from './utils/dataframe';

export const pinSplitOwner = (fullName = '') => {
  const parts = fullName.split('/');
  const name = parts[0];
  parts.pop();
  const owner = parts.join('/');

  return { name, owner };
};

export const pinContentName = (fullName) => {
  return typeof fullName === 'string' ? pinSplitOwner(fullName).name : fullName;
};

export const pinOwnerName = (fullName) => {
  return typeof fullName === 'string'
    ? pinSplitOwner(fullName).owner
    : fullName;
};

export const pinResultsFromRows = (entries) => {
  var resultsField = function (e, field, def) {
    return checks.isNull(e[field]) ? def : e[field];
  };

  var rows = entries.map((e) => {
    var row = {
      name: resultsField(e, 'name', fileSystem.basename(e['path'])),
      description: resultsField(e, 'description', ''),
      type: resultsField(e, 'type', 'files'),
    };
    row['metadata'] = dictRemove(e, ['name', 'description', 'type']);

    return row;
  });

  return dataFrame(rows, {
    name: 'character',
    description: 'character',
    type: 'character',
  });
};

export const pinResultsExtractColumn = (df, column) => {
  df[column] = Object.keys(df.metadata).map(
    (key) => JSON.parse(df.metadata[key])[column]
  );

  return df;
};

export const pinEntriesToDataframe = (entries) => {
  throw 'NYI';
};

export const pinResultsMerge = (r1, r2) => {
  var result = [].concat(r1).concat(r2);
  result.columns = {};
  Object.assign(result.columns, r1.columns);
  Object.assign(result.columns, r2.columns);
  return result;
};
