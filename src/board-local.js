import * as fileSystem from './host/file-system';

export const boardInitializeLocal = (board, cache, ...args) => {
  if (!fileSystem.dir.exists(board['cache']))
    fileSystem.dir.create(board['cache'], { recursive: true });

  return board;
};
