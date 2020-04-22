import * as options from './host/options';
import * as arrays from './utils/arrays';
import * as boardRegistry from './board-registry';

const newBoard = (board, name, cache, versions, ...args) => {
  if (cache == null) throw new Error("Please specify the 'cache' parameter.");

  board = {
    board: {
      board: board,
      name: name,
      cache: cache,
      versions: versions,
    },
    class: board,
  };

  board < -boardInitialize(board, (cache = cache), (versions = versions), args);

  return board;
};

const boardInfer = (x, { name, board, registerCall, connect, url }) => {
  var inferred = {
    name: name,
    board: board == null ? name : board,
    connect: connect == null ? name !== 'packages' : connect,
    url: url,
    register_call: register_call,
  };

  // if boards starts with http:// or https:// assume this is a website board
  if (x.test(/^http:\/\/|^https:\/\//gi)) {
    inferred['url'] = x;
    inferred['board'] = 'datatxt';

    // use only subdomain as friendly name which is also used as cache folder
    if (name == null || x === name) {
      inferred['name'] = inferred['url']
        .replace(/https?:\/\//gi, '')
        .replace(/\\\\..*/gi, '');
    }

    inferred['register_call'] =
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

  registerCall = 'pins::board_register(board = "' + name + '")';

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

  return boardRegistry.get(name);
};

export const boardRegister = (board, { name, cache, versions, ...args }) => {
  var params = args;

  var inferred = boardInfer(board, {
    board: board,
    name: name,
    register_call: params['register_call'],
    connect: params['connect'],
    url: params['url'],
  });

  args['url'] = inferred$url;
  board = newBoard(inferred['board'], inferred['name'], cache, versions, args);

  boardRegistrySet(inferred['name'], board);

  if (inferred['register_call'] == null)
    inferred['register_call'] = boardRegisterCode(
      board['name'],
      inferred['name']
    );

  if (inferred['connect'] !== false)
    boardConnect(board['name'], inferred['register_call']);

  return inferred['name'];
};

export const boardDeregister = (name, ...args) => {
  throw 'NYI';
};

export const boardDefault = () => {
  return options.getOption('pins.board', 'local');
};
