import * as checks from './utils/checks';
import * as fileSystem from './host/file-system';
import { dictRemove } from './utils/dict';
import { dataFrame } from './utils/dataframe';

export function pinSplitOwner(fullName = '') {
  const parts = fullName.split('/');
  const name = parts[0];
  parts.pop();
  const owner = parts.join('/');

  return { name, owner };
}

export function pinContentName(fullName) {
  return typeof fullName === 'string' ? pinSplitOwner(fullName).name : fullName;
}

export function pinOwnerName(fullName) {
  return typeof fullName === 'string'
    ? pinSplitOwner(fullName).owner
    : fullName;
}

export function pinResultsFromRows(entries) {
  var rows = entries.map((e) => {
    var row = {
      name: e.name || fileSystem.basename(e.path),
      description: e.description || '',
      type: e.type || 'files',
    };
    row['metadata'] = dictRemove(e, ['name', 'description', 'type']);

    return row;
  });

  return dataFrame(rows, {
    name: 'character',
    description: 'character',
    type: 'character',
  });
}

export function pinResultsExtractColumn(df, column) {
  // TODO: check
  // df[[column]] <- sapply(df$metadata, function(e) jsonlite::fromJSON(e)[[column]])
  if (df && df.metadata) {
    df[column] = df.metadata[column];
  }
  return df;
}

export function pinEntriesToDataframe(entries) {
  throw 'NYI';
}

export function pinResultsMerge(r1, r2) {
  var result = [].concat(r1).concat(r2);
  result.columns = {};
  Object.assign(result.columns, r1.columns);
  Object.assign(result.columns, r2.columns);
  return result;
}
