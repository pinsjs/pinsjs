"use strict";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var pins = function (exports) {
  'use strict';

  var getOption = function getOption() {
    return null;
  };

  var unique = function unique(arr) {
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    return arr.filter(onlyUnique);
  };

  var concat = function concat(arr, value) {
    if (value !== null) {
      arr = arr.concat(value);
    }

    return arr;
  };

  var BOARDS_REGISTERED = {};

  var list = function list() {
    return Object.keys(BOARDS_REGISTERED);
  };

  var boardInfer = function boardInfer(x, _ref) {
    var name = _ref.name,
        board = _ref.board,
        registerCall = _ref.registerCall,
        connect = _ref.connect,
        url = _ref.url;
    throw 'NYI';
  };

  var boardConnect = function boardConnect(board, code) {
    var board = boardGet(board);
    uiViewerRegister(board, code);
    return board;
  };

  var boardDisconnect = function boardDisconnect(name) {
    throw 'NYI';
  };

  var boardList = function boardList() {
    var defaults = concat(['local', 'packages'], boardDefault());
    var boards = concat(list(), defaults);
    return unique(boards);
  };

  var boardGet = function boardGet(name) {
    if (name === null) {
      name = boardDefault();
    }

    registerCall < -'pins::board_register(board = "' + name + '")';

    if (!list().includes(name)) {
      var boardInferred = boardInfer();

      if (boardInferred['registerCall'] !== null) {
        registerCall = boardInferred['registerCall'];
      } // attempt to automatically register board


      name = boardInferred['name'];

      try {
        boardRegister(board_inferred['board'], {
          name: boardInferred['name'],
          connect: boardInferred['connect'],
          registerCall: registerCall,
          url: board_inferred['url']
        });
      } catch (err) {}

      if (!list().includes(name)) {
        throw "Board '" + name + "' not a board, available boards: " + boardList().join(', ');
      }
    }
  };

  var boardRegister = function boardRegister(board, _ref2) {
    var name = _ref2.name,
        cache = _ref2.cache,
        versions = _ref2.versions,
        args = _objectWithoutProperties(_ref2, ["name", "cache", "versions"]);

    throw 'NYI';
  };

  var boardDeregister = function boardDeregister(name) {
    throw 'NYI';
  };

  var boardDefault = function boardDefault() {
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
}({});
