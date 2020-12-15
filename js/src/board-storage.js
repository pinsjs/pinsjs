import * as fileSystem from './host/file-system';
import { boardGet } from './board';
import { boardDefault } from './board-default';
import * as checks from './utils/checks';

export function boardLocalStorage(board) {
  if (typeof board === 'string') {
    board = boardGet(board);
  }

  var path = board['cache'];
  var componentPath = fileSystem.path(path, board['name']);

  if (!fileSystem.dir.exists(componentPath)) {
    fileSystem.dir.create(componentPath, { recursive: true });
  }

  return fileSystem.normalizePath(componentPath, { mustWork: false });
}
