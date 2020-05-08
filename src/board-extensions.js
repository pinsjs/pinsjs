import * as boardLocal from './board-local';
import * as checks from './utils/checks';
import * as fileSystem from './host/file-system';
import { useMethod } from './utils/inheritance';
import { boardDefault } from './board-default';

export const boardPinCreate = (board, path, name, metadata, ...args) => {
  return useMethod('boardPinCreate', board, path, name, metadata, ...args);
};

export const boardInitialize = (board, ...args) => {
  return useMethod('boardInitialize', board, ...args);
};

export const boardInitializeDefault = (board, ...args) => {
  stop("Board '", board$name, "' is not a valid board.");
};

export const boardPinGet = (board, name, ...args) => {
  return useMethod('boardPinGet', board, name, ...args);
};

export const boardPinRemove = (board, name, ...args) => {
  return useMethod('boardPinRemove', board, ...args);
};

export const boardPinFind = (board, text, ...args) => {
  return useMethod('boardPinFind', board, text, ...args);
};

export const boardPinVersions = (board, name, ...args) => {
  return useMethod('boardPinVersions', board, name, ...args);
};

export const boardBrowse = (board, ...args) => {
  return useMethod('boardBrowse', ...args);
};

// boardBrowse.default = function(board) { invisible(NULL) }

export const boardBrowseDefault = (board) => {
  return null;
};

export const boardEmptyResults = () => {
  // data.frame(name = c(), description = c(), rows = c(), cols = c(), class = c())
};

export const boardPinVersionsDefault = (board, name, ...args) => {
  //data.frame(version = character(0), stringsAsFactors = FALSE);
};
