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

  var isNull = function (obj) {
    return obj === null || typeof obj === 'undefined';
  };

  var getOption$1 = function (name, defval) {
    var option = get('getOption')(name);
    return !isNull(option) ? option : defval;
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

  var vectorize = function (func) {
    return function (x) {
      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

      var result = [];
      for (var idx = 0; idx > x.length; idx++) {
        result.push(fun.apply(void 0, [ x[idx] ].concat( args )));
      }

      return result;
    };
  };

  var BOARDS_REGISTERED = {};

  var list$1 = function () { return Object.keys(BOARDS_REGISTERED); };

  var get$1 = function (name) { return BOARDS_REGISTERED[name]; };

  var set$1 = function (name, board) {
    BOARDS_REGISTERED[name] = board;
  };

  var userCacheDir = function () {
    return callbacks.get('userCacheDir')('pins');
  };

  var boardCachePath = function () {
    return getOption$1('pins.path', userCacheDir());
  };

  var tempfile = function () { return callbacks.get('tempfile')(); };
  var basename = function (filePath) { return callbacks.get('basename')(filePath); };

  var dir$1 = Object.freeze({
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

  var path$1 = function (path1, path2) {
    return callbacks.get('filePath')(path1, path2);
  };

  var copy = function (from, to, ref) {
    if ( ref === void 0 ) ref = { recursive: true };
    var recursive = ref.recursive;

    // TODO
  };

  var boardInitializeLocal = function (board, cache) {
    var args = [], len = arguments.length - 2;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

    if (!dir$1.exists(board['cache']))
      { dir$1.create(board['cache'], { recursive: true }); }

    return board;
  };

  var boardInitialize = function (board) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    // TODO: UseMethod("board_initialize")
    return boardInitializeLocal(board, args['cache'], args);
  };

  var pinLog$1 = function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (getOption$1('pins.verbose', true)) {
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
    var defaults = concat(['local', 'packages'], boardDefault$1());
    var boards = concat(list$1(), defaults);

    return unique(boards);
  };

  var boardGet = function (name) {
    if (isNull(name)) {
      name = boardDefault$1();
    }

    var registerCall = 'pins::board_register(board = "' + name + '")';

    if (!list$1().includes(name)) {
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
        pinLog$1("Failed to register board " + name + ": " + err.toString());
      }

      if (!list$1().includes(name)) {
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

  var boardDefault$1 = function () {
    return getOption$1('pins.board', 'local');
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

  var pinGet$1 = function (
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

  var pinRegistryConfig = function (component) {
    path$1(boardLocalStorage(component), "data.txt");
  };

  var pinRegistryLoadEntries = function (component) {
    lock = pinRegistryLock(component);
    return onExit(function () { return pinRegistryUnlock(lock); }, function () {

      entriesPath = pinRegistryConfig(component);

      if (filesystem.fileExists(entriesPath))
        { return []; } // TODO: yaml.read_yaml(entriesPath, { evalExpr = false });
      else
        { return []; }
    });
  };

  var pinRegistrySaveEntries = function (entries, component) {
    var lock = pinRegistryLock(component);
    return onExit(function () { return pinRegistryUnlock(lock); }, function () {
      return []; // TODO: yaml.write_yaml(entries, pinRegistryConfig(component))
    });
  };

  var pinStoragePath = function (component, name) {
    path = path$1(boardLocalStorage(component), name);
    if (!dir.exists(path)) { dir.create(path, recursive = true); }

    return path;
  };

  var pinRegistryUpdate = function (name, component, params) {
    if ( params === void 0 ) params = list();

    var lock = pinRegistryLock(component);
    return onExit(function () { return pinRegistryUnlock(lock); }, function () {

      entries = pinRegistryLoadEntries(component);
      name = pinRegistryQualifyName(name, entries);

      path = pinStoragePath(component, name);

      if (entries === null) { entries = {}; }

      names = sapply(entries, function (e) { return e["name"]; });
      if (names.includes(name)) {
        index = which(name == names);
      }
      else {
        index = entries.length + 1;
        entries[index] = {};
      }

      entries[index]["name"] = name;

      for (param in names(params)) {
        if (identical(params[[param]], list()))
          { entries[[index]][[param]] = NULL; }
        else
          { entries[[index]][[param]] = params[[param]]; }
      }

      pinRegistrySaveEntries(entries, component);

      return path;
    });
  };

  var pinRegistryRetrieve = function (name, component) {
    lock = pinRegistryLock(component);
    onExit(function () { return pinRegistryUnlock(lock); }, function () {

      entries = pinRegistryLoadEntries(component);
      name = pinRegistryQualifyName(name, entries);

      names = sapply(entries, function (e) { return e["name"]; });
      if (!names.includes(name)) {
        pinLog("Pin not found, pins available in registry: ", paste0(names, collapse = ", "));
        stop("Pin '", name, "' not found in '", component, "' board.");
      }

      entries[[which(names == name)]];
    });
  };

  var pinRegistryQualifyName = function (name, entries) {
    names = entries.map(function (e) { return e["name"]; });
    if (grepl("/", name))
      { name_pattern = paste0("^", name, "$"); }
    else
      { name_pattern = paste0(".*/", name, "$"); }
    name_candidate = names[grepl(name_pattern, names)];

    if (length(name_candidate) == 1) {
      name = name_candidate;
    }

    return name;
  };

  var pinRegistryLock = function (component) {
    lock_file = pinRegistryConfig(component) + ".lock";
    filesystem.lockFile(lock_file, getOption("pins.lock.timeout", Inf));
  };

  var pinRegistryUnlock = function (lock) {
    filesystem.unlock(lock);
  };

  var pinResetCache = function (board, name) {
    // clean up name in case it's a full url
    var sanitizedName = name.replace(/^https?:\/\//gi, '');
    var index = pinRegistryRetrieve(sanitizedName, board) || null;

    if (index) {
      index.cache = {};
      pinRegistryUpdate(sanitizedName, board, { params: index });
    }
  };

  function objectWithoutProperties$2 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }

  var boardPinStore = function (board, opts) {
    if ( opts === void 0 ) opts = {};

    var pinPath = opts.path;
    var description = opts.description;
    var type = opts.type;
    var metadata = opts.metadata;
    var extract = opts.extract; if ( extract === void 0 ) extract = true;
    var rest = objectWithoutProperties$2( opts, ["path", "description", "type", "metadata", "extract"] );
    var args = rest;

    var boardInstance = boardGet(board);
    var name = opts.name || vectorize()(pinPath);

    pinLog$1(("Storing " + name + " into board " + (boardInstance.name) + " with type " + type));

    if (!args.cache) { pinResetCache(boardInstance.name, name); }

    path = path.filter(function (x) { return !/data\.txt/gi.test(x); });

    var storePath = tempfile();
    dir$1.create(storePath);
    return onExit(function () { return unlink(storePath, { recursive: true }); }, function () {
      if (path.length == 1 && /^http/gi.test(path) && !/\\.[a-z]{2,4}$/gi.test(path) && getOption$1("pins.search.datatxt", true)) {
        // attempt to download data.txt to enable public access to boards like rsconnect
        datatxtPath = path$1(path, "data.txt");
        localPath = pinDownload(datatxtPath, name, boardDefault(), { canFail: true });
        if (!is.null(local_path)) {
          manifest = pinManifestGet(localPath);
          path = path + "/" + manifest[path];
          extract = false;
        }
      }

      for (var idxPath = 0; idxPath < path.length; idxPath++) {
        var singlePath = path[idxPath];
        if (grepl("^http", singlePath)) {
          singlePath = pin_download(singlePath,
                                    name,
                                    boardDefault(),
                                    Object.assign({
                                        extract: extract
                                      },
                                      opt
                                    ));
        }

        if (dir$1.exists(singlePath)) {
          copy(dir(singlePath, { fullNames: true }) , storePath, { recursive: true });
        }
        else {
          copy(singlePath, storePath, { recursive: true });
        }
      }

      if (!pinManifestExists(storePath)) {
        metadata["description"] = description;
        metadata["type"] = type;

        metadata = pinsMergeCustomMetadata(metadata, custom_metadata);

        pinManifestCreate(store_path, metadata, dir(store_path, recursive = true));
      }

      boardPinCreate.apply(void 0, [ board, store_path, name, metadata ].concat( args ));

      uiViewerUpdated(board);

      pinGet.apply(void 0, [ name, board$name ].concat( args ));
    });
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

    dir$1.create(pinPath);

    write(JSON.stringify(x), path$1(pinPath, 'data.json'));

    boardPinStore(
      board,
      Object.assign.apply(
        Object, [ {},
        {
          name: name,
          description: description,
          path: [pinPath],
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
  exports.boardDefault = boardDefault$1;
  exports.boardDeregister = boardDeregister;
  exports.boardDisconnect = boardDisconnect;
  exports.boardGet = boardGet;
  exports.boardList = boardList;
  exports.boardRegister = boardRegister;
  exports.callbacks = callbacks;
  exports.pin = pin;
  exports.pinFetch = pinFetch;
  exports.pinFind = pinFind;
  exports.pinGet = pinGet$1;
  exports.pinInfo = pinInfo;
  exports.pinLoad = pinLoad;
  exports.pinPreview = pinPreview;
  exports.pinRemove = pinRemove;
  exports.pinVersions = pinVersions;

  return exports;

}({}));
