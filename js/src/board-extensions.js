import * as boardLocal from './board-local';
import * as checks from './utils/checks';
import * as fileSystem from './host/file-system';
import { useMethod, useMethodAsync } from './utils/inheritance';
import { boardDefault } from './board-default';
import { dataFrame } from './utils/dataframe';

export const boardPinCreate = async (board, path, name, metadata, ...args) => {
  return useMethodAsync('boardPinCreate', board, path, name, metadata, ...args);
};

export const boardInitialize = async (board, { ...args }) => {
  return await useMethodAsync('boardInitialize', board, ...args);
};

export const boardInitializeDefault = (board, ...args) => {
  throw new Error("Board '" + board['name'] + "' is not a valid board.");
};

export const boardPinGet = async (board, name, ...args) => {
  return useMethodAsync('boardPinGet', board, name, ...args);
};

export const boardPinRemove = async (board, name, ...args) => {
  return useMethodAsync('boardPinRemove', board, name, ...args);
};

export const boardPinFind = async (board, text, ...args) => {
  return useMethodAsync('boardPinFind', board, text, ...args);
};

export const boardPinVersions = (board, name, ...args) => {
  return useMethod('boardPinVersions', board, name, ...args);
};

export const boardBrowse = (board, ...args) => {
  return useMethod('boardBrowse', ...args);
};

export const boardBrowseDefault = (board, ...args) => {
  return null;
};

export const boardEmptyResults = () => {
  return dataFrame(null, {
    name: 'character',
    description: 'character',
    rows: 'numeric',
    cols: 'numeric',
    class: 'numeric',
  });
};

export const boardPinVersionsDefault = (board, name, ...args) => {
  return dataFrame(null, {
    version: 'character',
  });
};
