import system from './system';

export const pin = (...args) => {
  system.useMethod('pin', ...args);
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

export const pinPreview = (...args) => {
  system.useMethod('pinPreview', ...args);
};

export const pinLoad = (...args) => {
  system.useMethod('pinLoad', ...args);
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

export const pinFetch = (...args) => {
  system.useMethod('pinFetch', ...args);
};

export const pinVersions = (name, { board, full = false, ...args }) => {
  throw 'NYI';
};
