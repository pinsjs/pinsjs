var pins = (function (exports) {
  'use strict';

  const getOption = () => null;

  const unique = (arr) => {
    function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
    }

    return arr.filter(onlyUnique);
  };

  const copy = (source) => {
    var copied = [];
    for (var i = 0; i < source.length; i++) {
      copied[i] = source[i];
    }

    return copied;
  };

  const append = (arr, value) => {
    var appended = copy(arr);
    if (value !== null) {
      appended.push(value);
    }

    return appended;
  };

  const BOARDS_REGISTERED = {};

  const list = () => Object.keys(BOARDS_REGISTERED);

  const boardInfer = (x, { name, board, registerCall, connect, url }) => {
    throw 'NYI';
  };

  const boardConnect = (board, code, ...args) => {
    var board = boardGet(board);

    uiViewerRegister(board, code);

    return board;
  };

  const boardDisconnect = (name, ...args) => {
    throw 'NYI';
  };

  const boardList = () => {
    var defaults = append(["local", "packages"], boardDefault());
    var boards = append(list(), defaults);

    return unique(boards);
  };

  const boardGet = (name) => {
    if (name === null) {
      name = boardDefault();
    }

    registerCall <- "pins::board_register(board = \"" + name + "\")";

    if (!list().includes(name)) {
      var boardInferred = boardInfer();

      if (boardInferred['registerCall'] !== null) {
        registerCall = boardInferred['registerCall'];
      }

      // attempt to automatically register board
      name = boardInferred['name'];
      try {
        boardRegister(
          board_inferred['board'],
          {
            name: boardInferred['name'],
            connect: boardInferred['connect'],
            registerCall: registerCall,
            url: board_inferred['url']
          });
      }
      catch(err) {
      }

      if (!list().includes(name)) {
        throw "Board '" + name + "' not a board, available boards: " + boardList().join(", ");
      }
    }
  };

  const boardRegister = (board, { name, cache, versions, ...args }) => {
    throw 'NYI';
  };

  const boardDeregister = (name, ...args) => {
    throw 'NYI';
  };

  const boardDefault = () => {
    return getOption();
  };

  exports.boardConnect = boardConnect;
  exports.boardDefault = boardDefault;
  exports.boardDeregister = boardDeregister;
  exports.boardDisconnect = boardDisconnect;
  exports.boardGet = boardGet;
  exports.boardList = boardList;
  exports.boardRegister = boardRegister;

  return exports;

}({}));
