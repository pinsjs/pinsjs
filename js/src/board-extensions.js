import * as boardLocal from './board-local';
import * as checks from './utils/checks';
import * as fileSystem from './host/file-system';
import { useMethod, useMethodAsync } from './utils/inheritance';
import { boardDefault } from './board-default';
import { dataFrame } from './utils/dataframe';

export async function boardPinCreate(board, path, name, metadata, ...args) {
  return useMethodAsync('boardPinCreate', board, path, name, metadata, ...args);
}

export async function boardInitialize(board, { ...args }) {
  return await useMethodAsync('boardInitialize', board, ...args);
}

export function boardInitializeDefault(board, ...args) {
  throw new Error("Board '" + board['name'] + "' is not a valid board.");
}

export async function boardPinGet(board, name, ...args) {
  return useMethodAsync('boardPinGet', board, name, ...args);
}

export async function boardPinRemove(board, name, ...args) {
  return useMethodAsync('boardPinRemove', board, name, ...args);
}

export async function boardPinFind(board, text, ...args) {
  return useMethodAsync('boardPinFind', board, text, ...args);
}

export function boardPinVersions(board, name, ...args) {
  return useMethod('boardPinVersions', board, name, ...args);
}

export function boardBrowse(board, ...args) {
  return useMethod('boardBrowse', ...args);
}

export function boardBrowseDefault(board, ...args) {
  return null;
}

export function boardEmptyResults() {
  return dataFrame(null, {
    name: 'character',
    description: 'character',
    rows: 'numeric',
    cols: 'numeric',
    class: 'numeric',
  });
}

export function boardPinVersionsDefault(board, name, ...args) {
  return dataFrame(null, {
    version: 'character',
  });
}
