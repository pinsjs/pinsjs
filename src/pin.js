export const pinDefaultName = (x, board) => {
  throw 'NYI';
};

export const pin = (x, { name, description, board, ...args }) => {
  throw 'NYI';
};

export const pinGet = (
  name,
  { board, cache, extract, version, files, signature, ...args }
) => {
  throw 'NYI';
};

export const pinRemove = (name, board) => {
  throw 'NYI';
};

const pinFindEmpty = () => {
  throw 'NYI';
};

export const pinFind = ({ text, board, name, extended, ...args }) => {
  throw 'NYI';
};

export const pinPreview = (x, { board, ...args }) => {
  throw 'NYI';
};

export const pinLoad = (path, ...args) => {
  throw 'NYI';
};

const pinFiles = (name, { board, ...args }) => {
  throw 'NYI';
};

const pinGetOne = (name, board, extended, metadata) => {
  throw 'NYI';
};

export const pinInfo = (
  name,
  { board, extended, metadata, signature, ...args }
) => {
  throw 'NYI';
};

const printPinInfo = (name, e, ident) => {
  throw 'NYI';
};

export const pinFetch = (path, ...args) => {
  throw 'NYI';
};

export const pinVersions = (name, { board, full = false, ...args }) => {
  throw 'NYI';
};
