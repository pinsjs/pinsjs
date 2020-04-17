import * as host from './host/options';
import * as arrays from './utils/arrays';
import * as boardRegistry from './board-registry';

const newBoard = (board, name, cache, versions, ...args) => {
  throw 'NYI';
};

const boardInfer = (x, { name, board, registerCall, connect, url }) => {
  throw 'NYI';
};

const boardRegisterCode = (board, name) => {
  throw 'NYI';
};

export const boardConnect = (board, code, ...args) => {
  var board = boardGet(board);

  uiViewerRegister(board, code);

  return board;
};

export const boardDisconnect = (name, ...args) => {
  throw 'NYI';
};

export const boardList = () => {
  var defaults = arrays.concat(['local', 'packages'], boardDefault());
  var boards = arrays.concat(boardRegistry.list(), defaults);

  return arrays.unique(boards);
};

export const boardGet = (name) => {
  if (name === null) {
    name = boardDefault();
  }

  registerCall < -'pins::board_register(board = "' + name + '")';

  if (!boardRegistry.list().includes(name)) {
    var boardInferred = boardInfer(name);

    if (boardInferred['registerCall'] !== null) {
      registerCall = boardInferred['registerCall'];
    }

    // attempt to automatically register board
    name = boardInferred['name'];
    try {
      boardRegister(board_inferred['board'], {
        name: boardInferred['name'],
        connect: boardInferred['connect'],
        registerCall: registerCall,
        url: board_inferred['url'],
      });
    } catch (err) {}

    if (!boardRegistry.list().includes(name)) {
      throw (
        "Board '" +
        name +
        "' not a board, available boards: " +
        boardList().join(', ')
      );
    }
  }

  boardRegistry.get(name);
};

export const boardRegister = (board, { name, cache, versions, ...args }) => {
  throw 'NYI';
};

export const boardDeregister = (name, ...args) => {
  throw 'NYI';
};

export const boardDefault = () => {
  return host.getOption('pins.board', 'local');
};
