import * as checks from './utils/checks';
import * as fileSystem from './host/file-system';

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

export const dictRemove = (dict, removes) => {
  var copy = {};
  Object.assign(copy, dict);
  removes.forEach((remove) => {
    if (copy.hasOwnProperty(remove)) delete copy[remove];
  });
  return copy;
};

export const pinResultsFromRows = (entries) => {
  var resultsField = function (e, field, def) {
    return checks.isNull(e[field]) ? def : e[field];
  };

  var dataFrame = entries.map((e) => {
    var row = {
      name: resultsField(e, 'name', fileSystem.basename(e['path'])),
      description: resultsField(e, 'description', ''),
      type: resultsField(e, 'type', 'files'),
    };
    row['metadata'] = dictRemove(e, ['name', 'description', 'type']);

    return row;
  });

  return dataFrame;
};

// TODO: Implement dataframes shim.
export const pinResultsExtractColumn = (df, column) => {
  throw 'NYI';
};

export const pinEntriesToDataframe = (entries) => {
  throw 'NYI';
};

export const pinResultsMerge = (r1, r2, merge) => {
  throw 'NYI';
};
