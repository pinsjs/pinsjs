import * as fileSystem from './host/file-system';
import { boardDefault } from './board-default';
import * as checks from './utils/checks';
import { boardGet } from './board';

export const boardLocalStorage = (component, board) => {
  if (checks.isNull(component)) component = boardDefault();
  if (checks.isNull(board)) board = boardGet(component);

  var path = board['cache'];

  var componentPath = fileSystem.path(path, component);

  if (!fileSystem.dir.exists(componentPath))
    fileSystem.dir.create(componentPath, { recursive: true });

  return fileSystem.normalizePath(componentPath, { mustWork: false });
};
