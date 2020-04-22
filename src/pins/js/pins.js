var pins = (function (exports) {
  'use strict';

  var HOST_CALLBACKS = {};

  var get = function (name) {
    var callback = HOST_CALLBACKS[name];

    if (callback) { return callback; }
    else { return function () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      return null;
    }; }
  };

  var set = function (name, callback) {
    HOST_CALLBACKS[name] = callback;
  };

  var callbacks = {
    get: get,
    set: set,
  };

  var getOption = function (name) { return get('getOption')(name); };

  var unique = function (arr) {
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    return arr.filter(onlyUnique);
  };

  var concat = function (arr, value) {
    if (value !== null) {
      arr = arr.concat(value);
    }

    return arr;
  };

  var BOARDS_REGISTERED = {};

  var list = function () { return Object.keys(BOARDS_REGISTERED); };

  var get$1 = function (name) { return BOARDS_REGISTERED[name]; };

  function objectWithoutProperties (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }

  var newBoard = function (board, name, cache, versions) {
    var args = [], len = arguments.length - 4;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 4 ];

    if (cache == null) { throw new Error("Please specify the 'cache' parameter."); }

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

  var boardInfer = function (x, ref) {
    var name = ref.name;
    var board = ref.board;
    var registerCall = ref.registerCall;
    var connect = ref.connect;
    var url = ref.url;

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

    if (inferred['name'] == null) { inferred['name'] = x; }
    if (inferred['board'] == null) { inferred['board'] = x; }

    return inferred;
  };

  var boardRegisterCode = function (board, name) {
    throw 'NYI';
  };

  var boardConnect = function (board, code) {
    var args = [], len = arguments.length - 2;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

    var board = boardGet(board);

    uiViewerRegister(board, code);

    return board;
  };

  var boardDisconnect = function (name) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    throw 'NYI';
  };

  var boardList = function () {
    var defaults = concat(['local', 'packages'], boardDefault());
    var boards = concat(list(), defaults);

    return unique(boards);
  };

  var boardGet = function (name) {
    if (name === null) {
      name = boardDefault();
    }

    registerCall = 'pins::board_register(board = "' + name + '")';

    if (!list().includes(name)) {
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

      if (!list().includes(name)) {
        throw (
          "Board '" +
          name +
          "' not a board, available boards: " +
          boardList().join(', ')
        );
      }
    }

    return get$1(name);
  };

  var boardRegister = function (board, ref) {
    var name = ref.name;
    var cache = ref.cache;
    var versions = ref.versions;
    var rest = objectWithoutProperties( ref, ["name", "cache", "versions"] );
    var args = rest;

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
      { inferred['register_call'] = boardRegisterCode(
        board['name']); }

    if (inferred['connect'] !== false)
      { boardConnect(board['name'], inferred['register_call']); }

    return inferred['name'];
  };

  var boardDeregister = function (name) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    throw 'NYI';
  };

  var boardDefault = function () {
    return getOption('pins.board');
  };

  exports.boardConnect = boardConnect;
  exports.boardDefault = boardDefault;
  exports.boardDeregister = boardDeregister;
  exports.boardDisconnect = boardDisconnect;
  exports.boardGet = boardGet;
  exports.boardList = boardList;
  exports.boardRegister = boardRegister;
  exports.callbacks = callbacks;

  return exports;

}({}));
