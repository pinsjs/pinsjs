import * as boardLocal from './board-local';

export const boardInitialize = (board, ...args) => {
  // TODO: UseMethod("board_initialize")
  return boardLocal.boardInitializeLocal(board, args['cache'], args);
};
