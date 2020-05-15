import { pinRegistryRetrieve, pinRegistryUpdate } from './pin-registry';

export const pinSplitOwner = (fullName = '') => {
  const parts = fullName.split('/');
  const name = parts.pop() || null;
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

// TODO: Implement dataframes shim.
export const pinResultsFromRows = (entries) => {
  throw 'NYI';
};

// TODO: Implement dataframes shim.
export const pinResultsExtractColumn = (df, column) => {
  throw 'NYI';
};

export const pinResetCache = (board, name) => {
  // clean up name in case it's a full url
  const sanitizedName = name.replace(/^https?:\/\//g, '');
  const index = pinRegistryRetrieve(sanitizedName, board) || null;

  if (index) {
    index.cache = {};
    pinRegistryUpdate(sanitizedName, board, { params: index });
  }
};

export const pinEntriesToDataframe = (entries) => {
  throw 'NYI';
};

export const pinResultsMerge = (r1, r2, merge) => {
  throw 'NYI';
};
