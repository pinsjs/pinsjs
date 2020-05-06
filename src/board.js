import * as options from './host/options';
import * as arrays from './utils/arrays';
import callbacks from './host/callbacks';
import * as boardRegistry from './board-registry';
import { boardCachePath } from './board-registration';
import { boardInitialize } from './board-extensions';
import { pinLog } from './log';
import * as checks from './utils/checks';

const newBoard = (board, name, cache, versions, ...args) => {
  if (cache == null) throw new Error("Please specify the 'cache' parameter.");

  board = {
    board: board,
    name: name,
    cache: cache,
    versions: versions,
    class: board,
  };

  board = boardInitialize(board, (cache = cache), (versions = versions), args);

  return board;
};

const boardInfer = (x, { name, board, registerCall, connect, url }) => {
  var inferred = {
    name: name,
    board: board == null ? name : board,
    connect: connect == null ? name !== 'packages' : connect,
    url: url,
    registerCall: registerCall,
  };

  // if boards starts with http:// or https:// assume this is a website board
  if (/^http:\/\/|^https:\/\//gi.test(x)) {
    inferred['url'] = x;
    inferred['board'] = 'datatxt';

    // use only subdomain as friendly name which is also used as cache folder
    if (name == null || x === name) {
      inferred['name'] = inferred['url']
        .replace(/https?:\/\//gi, '')
        .replace(/\\\\..*/gi, '');
    }

    inferred['registerCall'] =
      'pins::board_register(board = "datatxt", name = "' +
      inferred['name'] +
      '", url = "' +
      inferred['url'] +
      '")';
  }

  if (inferred['name'] == null) inferred['name'] = x;
  if (inferred['board'] == null) inferred['board'] = x;

  return inferred;
};

const boardRegisterCode = (board, name) => {
  return callbacks.get('boardRegisterCode')(board, name);
};

export const boardConnect = (board, code, ...args) => {
  var board = boardGet(board);

  callbacks.get('uiViewerRegister')(board, code);

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
  if (checks.isNull(name)) {
    name = boardDefault();
  }

  var registerCall = 'pins::board_register(board = "' + name + '")';

  if (!boardRegistry.list().includes(name)) {
    var boardInferred = boardInfer(name, {});

    if (boardInferred['registerCall'] !== null) {
      registerCall = boardInferred['registerCall'];
    }

    // attempt to automatically register board
    name = boardInferred['name'];
    try {
      boardRegister(boardInferred['board'], {
        name: boardInferred['name'],
        connect: boardInferred['connect'],
        registerCall: registerCall,
        url: boardInferred['url'],
      });
    } catch (err) {
      pinLog(`Failed to register board ${name}: ` + err.toString());
    }

    if (!boardRegistry.list().includes(name)) {
      throw (
        "Board '" +
        name +
        "' not a board, available boards: " +
        boardList().join(', ')
      );
    }
  }

  return boardRegistry.get(name);
};

export const boardRegister = (board, { name, cache, versions, ...args }) => {
  if (name == null) name = board;
  if (cache == null) cache = boardCachePath();

  var inferred = boardInfer(board, {
    board: board,
    name: name,
    registerCall: args['registerCall'],
    connect: args['connect'],
    url: args['url'],
  });

  args['url'] = inferred['url'];
  board = newBoard(inferred['board'], inferred['name'], cache, versions, args);

  boardRegistry.set(inferred['name'], board);

  if (inferred['registerCall'] == null)
    inferred['registerCall'] = boardRegisterCode(
      board['name'],
      inferred['name']
    );

  if (inferred['connect'] !== false)
    boardConnect(board['name'], inferred['registerCall']);

  return inferred['name'];
};

export const boardDeregister = (name, ...args) => {
  throw 'NYI';
};
