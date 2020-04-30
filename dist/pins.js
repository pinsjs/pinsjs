var pins = (function (exports) {
  'use strict';

  var HOST_CALLBACKS = {};

  var get = function (name) {
    if (Object.keys(HOST_CALLBACKS).includes(name)) { return HOST_CALLBACKS[name]; }
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

  var getOption = function (name, defval) {
    var option = get('getOption')(name);
    return option != null ? option : defval;
  };

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

  var set$1 = function (name, board) {
    BOARDS_REGISTERED[name] = board;
  };

  var userCacheDir = function () {
    return callbacks.get('userCacheDir')('pins');
  };

  var boardCachePath = function () {
    return getOption('pins.path', userCacheDir());
  };

  var tempfile = function () { return callbacks.get('tempfile')(); };
  var basename = function (filePath) { return callbacks.get('basename')(filePath); };

  var dir = Object.freeze({
    create: function create(dirPath, ref) {
      if ( ref === void 0 ) ref = { recursive: false };
      var recursive = ref.recursive;

      callbacks.get('dirCreate')(dirPath);
    },
    exists: function exists(dirPath) {
      callbacks.get('dirExists')(dirPath);
    },
  });

  var tools = Object.freeze({
    filePathSansExt: function filePathSansExt(filePath) {
      return filePath.replace(/\.[^/.]+$/, '');
    },
  });

  var write = function (object, path) {
    callbacks.get('fileWrite')(JSON.stringify(object), path);
  };

  var read = function (path) {
    return callbacks.get('fileRead')(path);
  };

  var path = function (path1, path2) {
    return callbacks.get('filePath')(path1, path2);
  };

  var boardInitializeLocal = function (board, cache) {
    var args = [], len = arguments.length - 2;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

    if (!dir.exists(board['cache']))
      { dir.create(board['cache'], { recursive: true }); }

    return board;
  };

  var boardInitialize = function (board) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    // TODO: UseMethod("board_initialize")
    return boardInitializeLocal(board, args['cache'], args);
  };

  var pinLog = function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (getOption('pins.verbose', true)) {
      callbacks.get('pinLog')(args.join(''));
    }
  };

  function objectWithoutProperties (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }

  var newBoard = function (board, name, cache, versions) {
    var args = [], len = arguments.length - 4;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 4 ];

    if (cache == null) { throw new Error("Please specify the 'cache' parameter."); }

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

    if (inferred['name'] == null) { inferred['name'] = x; }
    if (inferred['board'] == null) { inferred['board'] = x; }

    return inferred;
  };

  var boardRegisterCode = function (board, name) {
    return callbacks.get('boardRegisterCode')(board, name);
  };

  var boardConnect = function (board, code) {
    var args = [], len = arguments.length - 2;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

    var board = boardGet(board);

    callbacks.get('uiViewerRegister')(board, code);

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

    var registerCall = 'pins::board_register(board = "' + name + '")';

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
          url: boardInferred['url'],
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

    if (name == null) { name = board; }
    if (cache == null) { cache = boardCachePath(); }

    var inferred = boardInfer(board, {
      board: board,
      name: name,
      registerCall: args['registerCall'],
      connect: args['connect'],
      url: args['url'],
    });

    args['url'] = inferred['url'];
    board = newBoard(inferred['board'], inferred['name'], cache, versions, args);

    set$1(inferred['name'], board);

    if (inferred['registerCall'] == null)
      { inferred['registerCall'] = boardRegisterCode(
        board['name'],
        inferred['name']
      ); }

    if (inferred['connect'] !== false)
      { boardConnect(board['name'], inferred['registerCall']); }

    return inferred['name'];
  };

  var boardDeregister = function (name) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    throw 'NYI';
  };

  var boardDefault = function () {
    return getOption('pins.board', 'local');
  };

  var METHODS = {};
  var DEFAULT_CLASS_NAME = 'default';

  var registerMethod = function (methodName, className, method) {
    METHODS[methodName] = METHODS[methodName] || {};
    METHODS[methodName][className] = method;

    return method;
  };

  var useMethod = function (methodName, object) {
    var ref, ref$1;

    var args = [], len = arguments.length - 2;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];
    var className =
      object && object.constructor ? object.constructor.name : DEFAULT_CLASS_NAME;

    if (METHODS[methodName] && METHODS[methodName][className]) {
      return (ref = METHODS[methodName])[className].apply(ref, [ object ].concat( args ));
    }

    if (METHODS[methodName] && METHODS[methodName]['default']) {
      return (ref$1 = METHODS[methodName])['default'].apply(ref$1, [ object ].concat( args ));
    }

    throw new Error(
      ("no applicable method for '" + methodName + "' applied to an object of class '" + className + "'")
    );
  };

  function objectWithoutProperties$1 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }

  var pin = function (x) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    useMethod.apply(void 0, [ 'pin', x ].concat( args ));
  };

  var pinGet = function (
    name,
    ref
  ) {
    var board = ref.board;
    var cache = ref.cache;
    var extract = ref.extract;
    var version = ref.version;
    var files = ref.files;
    var signature = ref.signature;
    var rest = objectWithoutProperties$1( ref, ["board", "cache", "extract", "version", "files", "signature"] );

    throw 'NYI';
  };

  var pinRemove = function (name, board) {
    throw 'NYI';
  };

  var pinFind = function (ref) {
    var text = ref.text;
    var board = ref.board;
    var name = ref.name;
    var extended = ref.extended;
    var rest = objectWithoutProperties$1( ref, ["text", "board", "name", "extended"] );

    throw 'NYI';
  };

  var pinPreview = function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    useMethod.apply(void 0, [ 'pinPreview' ].concat( args ));
  };

  var pinLoad = function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    useMethod.apply(void 0, [ 'pinLoad' ].concat( args ));
  };

  var pinInfo = function (
    name,
    ref
  ) {
    var board = ref.board;
    var extended = ref.extended;
    var metadata = ref.metadata;
    var signature = ref.signature;
    var rest = objectWithoutProperties$1( ref, ["board", "extended", "metadata", "signature"] );

    throw 'NYI';
  };

  var pinFetch = function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    useMethod.apply(void 0, [ 'pinFetch' ].concat( args ));
  };

  var pinVersions = function (name, ref) {
    var board = ref.board;
    var full = ref.full; if ( full === void 0 ) full = false;
    var rest = objectWithoutProperties$1( ref, ["board", "full"] );

    throw 'NYI';
  };

  var BoardName = Object.freeze({
    kaggle: 'kaggle',
  });

  var pinDefaultName = function (x, board) {
    var name = basename(x);
    var error = new Error(
      "Can't auto-generate pin name from object, please specify the 'name' parameter."
    );

    if (!name) {
      throw error;
    }

    var sanitized = name
      .replace(/[^a-zA-Z0-9-]/gi, '-')
      .replace(/^-*|-*$/gi, '')
      .replace(/-+/gi, '-');

    if (!sanitized) {
      throw error;
    }

    if (board === BoardName.kaggle && sanitized.length < 5) {
      return (sanitized + "-pin");
    }

    return sanitized;
  };

  var pinRegistryRetrieve = function () {
    throw 'NYI';
  };

  var pinRegistryUpdate = function () {
    throw 'NYI';
  };

  var pinResetCache = function (board, name) {
    // clean up name in case it's a full url
    var sanitizedName = name.replace(/^https?:\/\//gi, '');
    var index = pinRegistryRetrieve() || null;

    if (index) {
      index.cache = {};
      pinRegistryUpdate();
    }
  };

  function objectWithoutProperties$2 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }

  var pinNameFromPath = function (pinPath) {
    var baseName = basename(pinPath);
    var baseNameWithoutExt = tools.filePathSansExt(baseName);

    return baseNameWithoutExt.replace(/[^a-zA-Z0-9]+/gi, '_');
  };

  var boardPinStore = function (board, opts) {
    if ( opts === void 0 ) opts = {};

    var pinPath = opts.path;
    var description = opts.description;
    var type = opts.type;
    var metadata = opts.metadata;
    var extract = opts.extract; if ( extract === void 0 ) extract = true;
    var rest = objectWithoutProperties$2( opts, ["path", "description", "type", "metadata", "extract"] );
    var args = rest;
    var name = opts.name || pinNameFromPath(pinPath);
    var boardInstance = boardGet(board);

    pinLog(("Storing " + name + " into board " + (boardInstance.name) + " with type " + type));

    if (!args.cache) { pinResetCache(boardInstance.name, name); }

    // TODO: is path a vector here?
    // path <- path[!grepl("data\\.txt", path)]

    var storePath = tempfile();
    dir.create(storePath);

    // TODO: not sure about path here...
    throw 'NYI';
  };

  function objectWithoutProperties$3 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }

  var pinDefault = function (x, opts) {
    if ( opts === void 0 ) opts = {};

    var description = opts.description;
    var board = opts.board;
    var rest = objectWithoutProperties$3( opts, ["description", "board"] );
    var args = rest;
    var name = opts.name || pinDefaultName(x, board);
    var pinPath = tempfile();

    dir.create(pinPath);

    write(
      JSON.stringify(x),
      path(pinPath, 'data.json')
    );

    boardPinStore(
      board,
      Object.assign.apply(
        Object, [ {},
        {
          name: name,
          description: description,
          path: pinPath,
          type: 'default',
          metadata: [],
        } ].concat( args )
      )
    );
  };

  var pinPreviewDefault = function (x) { return x; };

  var pinLoadDefault = function (pinPath) {
    return JSON.parse(read(pinPath));
  };

  var pinFetchDefault = function (pinPath) { return pinPath; };

  registerMethod('pin', 'default', pinDefault);
  registerMethod(
    'pinPreview',
    'default',
    pinPreviewDefault
  );
  registerMethod('pinLoad', 'default', pinLoadDefault);
  registerMethod('pinFetch', 'default', pinFetchDefault);

  exports.boardConnect = boardConnect;
  exports.boardDefault = boardDefault;
  exports.boardDeregister = boardDeregister;
  exports.boardDisconnect = boardDisconnect;
  exports.boardGet = boardGet;
  exports.boardList = boardList;
  exports.boardRegister = boardRegister;
  exports.callbacks = callbacks;
  exports.pin = pin;
  exports.pinFetch = pinFetch;
  exports.pinFind = pinFind;
  exports.pinGet = pinGet;
  exports.pinInfo = pinInfo;
  exports.pinLoad = pinLoad;
  exports.pinPreview = pinPreview;
  exports.pinRemove = pinRemove;
  exports.pinVersions = pinVersions;

  return exports;

}({}));
