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

  var isDataFrame = function (x) {
    return typeof x['class'] !== undefined && x['class'] === 'dataframe';
  };

  var getOption = function (name, defval) {
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

  var ensure = function (obj) {
    if (!Array.isArray(obj)) {
      return [obj];
    } else {
      return obj;
    }
  };

  var getOne = function (obj) {
    if (Array.isArray(obj)) {
      if (obj.length == 1) {
        obj = obj[0];
      } else {
        throw new Exception('Array unsupported in dir.list.');
      }
    }

    return obj;
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
    return getOption('pins.path', userCacheDir());
  };

  var tempfile = function () { return callbacks.get('tempfile')(); };
  var basename = function (filePath) { return callbacks.get('basename')(filePath); };
  var readLines = function (filePath) { return callbacks.get('readLines')(filePath); };
  var writeLines = function (filePath, content) { return callbacks.get('writeLines')(filePath, content); };

  var dir$1 = Object.freeze({
    create: function create(dirPath, ref) {
      if ( ref === void 0 ) ref = { recursive: false };
      var recursive = ref.recursive;

      return callbacks.get('dirCreate')(dirPath);
    },
    exists: function exists(dirPath) {
      return callbacks.get('dirExists')(dirPath);
    },
    list: function list(dirPath) {
      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

      return callbacks.get('dirList')(getOne(dirPath));
    },
    remove: function remove(dirPath) {
      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

      dirPath = ensure(dirPath);
      return dirPath.map(function (e) { return callbacks.get('dirRemove')(dirPath); });
    },
    zip: function zip(dirPath, zipfile) {
      var ags = [], len = arguments.length - 2;
      while ( len-- > 0 ) ags[ len ] = arguments[ len + 2 ];

      return callbacks.get('dirZip')(dirPath, dirPath);
    },
  });

  var tools = Object.freeze({
    filePathSansExt: function filePathSansExt(filePath) {
      return filePath.replace(/\.[^/.]+$/, '');
    },
    fileExt: function fileExt(filePath) {
      return filePath.match(/\.[^/.]+$/, '')[0];
    },
  });

  var write = function (object, path) {
    return callbacks.get('fileWrite')(object, path);
  };

  var read = function (path) {
    return callbacks.get('fileRead')(path);
  };

  var path = function (path1, path2) {
    return callbacks.get('filePath')(path1, path2);
  };

  var normalizePath = function (
    path,
    ref
  ) {
    if ( ref === void 0 ) ref = { winslash: '\\', mustWork: false };
    var winslash = ref.winslash;
    var mustWork = ref.mustWork;

    return path;
  };

  var absolutePath = function (path) { return path; };

  var lockFile = function (path, timeout) {
    return callbacks.get('fileExists')(path);
  };

  var unlockFile = function (path) {
    return callbacks.get('fileExists')(path);
  };

  var fileExists = function (path) {
    return callbacks.get('fileExists')(path);
  };

  var copy = function (from, to, ref) {
    if ( ref === void 0 ) ref = { recursive: true };
    var recursive = ref.recursive;

    return callbacks.get('fileCopy')(from, to, recursive);
  };

  var pinVersionsPathName = function () {
    return getOption('pins.versions.path', '_versions');
  };

  var pinVersionSignature$1 = function (hash_files) {
    var signature = ''; // TODO sapply(hash_files, function(x) digest::digest(x, algo = "sha1", file = TRUE))

    if (signature.length > 1) {
      signature = paste(signature, (collapse = ','));
      signature = ''; // TODO digest::digest(signature, (algo = 'sha1'), (file = FALSE));
    }

    return signature;
  };

  var pinVersionsPath = function (storagePath) {
    var hashFiles = dir$1.list(storagePath, { fullNames: true });
    hashFiles = hashFiles.filter(function (e) { return /(\/|\\)_versions$/g.test(e); });

    var version = pinVersionSignature$1();

    return normalizePath(
      path(
        normalizePath(storagePath),
        pinVersionsPathName()),
      { mustWork: false }
    );
  };

  var boardVersionsEnabled = function (
    board,
    ref
  ) {
    if ( ref === void 0 ) ref = { defaultValue: false };
    var defaultValue = ref.defaultValue;

    if (defaultValue) {
      return board['versions'] !== false;
    } else {
      return board['versions'] === true;
    }
  };

  var boardVersionsCreate = function (board, name, path$1) {
    var versions = null;

    if (boardVersionsEnabled(board)) {
      // read the versions from the non-versioned manifest
      var componentPath = pinStoragePath(board, name);
      var componentManifest = pinManifestGet(componentPath);
      var versions = componentManifest['versions'];

      var versionPath = pinVersionsPath(path$1);
      var versionRelative = pinRegistryRelative(versionPath, path$1);

      if (any(component_manifest$versions == version_relative)) {
        versions = versions.filter(function (e) { return e != versionRelative; });
      }

      if (dir$1.exists(versionPath))
        { dir$1.removeunlink(versionPath, { recursive: true }); }
      dir$1.create(versionPath, { recursive: true });

      var files = dir$1.list(path$1, { fullNames: true });
      files = files.filter(
        function (e) { return e != path(path$1, pinVersionsPathName()); }
      );
      copy(files, versionPath, { recursive: true });

      versions = c(list(versionRelative), versions);

      manifest = pinManifestGet(path$1);
      manifest['versions'] = versions;
      pin_manifest_update(path$1, manifest);
    }

    return versions;
  };

  var boardDefault = function () {
    return getOption('pins.board', 'local');
  };

  var boardLocalStorage = function (board) {
    var path$1 = board['cache'];

    var componentPath = path(path$1, board['name']);

    if (!dir$1.exists(componentPath))
      { dir$1.create(componentPath, { recursive: true }); }

    return normalizePath(componentPath, { mustWork: false });
  };

  var onExit = function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var error = null;
    var result = null;
    try {
      result = args[args.length - 1]();
    } catch (err) {
      error = err;
    }

    for (var idx = 0; idx < args.length - 2; idx++) { args[idx](); }

    if (error !== null) { throw error; }

    return result;
  };

  var pinLog = function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (getOption('pins.verbose', true)) {
      callbacks.get('pinLog')(args.join(''));
    }
  };

  function isNothing(subject) {
    return (typeof subject === 'undefined') || (subject === null);
  }


  function isObject(subject) {
    return (typeof subject === 'object') && (subject !== null);
  }


  function toArray(sequence) {
    if (Array.isArray(sequence)) { return sequence; }
    else if (isNothing(sequence)) { return []; }

    return [ sequence ];
  }


  function extend(target, source) {
    var index, length, key, sourceKeys;

    if (source) {
      sourceKeys = Object.keys(source);

      for (index = 0, length = sourceKeys.length; index < length; index += 1) {
        key = sourceKeys[index];
        target[key] = source[key];
      }
    }

    return target;
  }


  function repeat(string, count) {
    var result = '', cycle;

    for (cycle = 0; cycle < count; cycle += 1) {
      result += string;
    }

    return result;
  }


  function isNegativeZero(number) {
    return (number === 0) && (Number.NEGATIVE_INFINITY === 1 / number);
  }


  var isNothing_1      = isNothing;
  var isObject_1       = isObject;
  var toArray_1        = toArray;
  var repeat_1         = repeat;
  var isNegativeZero_1 = isNegativeZero;
  var extend_1         = extend;

  var common = {
  	isNothing: isNothing_1,
  	isObject: isObject_1,
  	toArray: toArray_1,
  	repeat: repeat_1,
  	isNegativeZero: isNegativeZero_1,
  	extend: extend_1
  };

  // YAML error class. http://stackoverflow.com/questions/8458984

  function YAMLException(reason, mark) {
    // Super constructor
    Error.call(this);

    this.name = 'YAMLException';
    this.reason = reason;
    this.mark = mark;
    this.message = (this.reason || '(unknown reason)') + (this.mark ? ' ' + this.mark.toString() : '');

    // Include stack trace in error object
    if (Error.captureStackTrace) {
      // Chrome and NodeJS
      Error.captureStackTrace(this, this.constructor);
    } else {
      // FF, IE 10+ and Safari 6+. Fallback for others
      this.stack = (new Error()).stack || '';
    }
  }


  // Inherit from Error
  YAMLException.prototype = Object.create(Error.prototype);
  YAMLException.prototype.constructor = YAMLException;


  YAMLException.prototype.toString = function toString(compact) {
    var result = this.name + ': ';

    result += this.reason || '(unknown reason)';

    if (!compact && this.mark) {
      result += ' ' + this.mark.toString();
    }

    return result;
  };


  var exception$1 = YAMLException;

  function Mark(name, buffer, position, line, column) {
    this.name     = name;
    this.buffer   = buffer;
    this.position = position;
    this.line     = line;
    this.column   = column;
  }


  Mark.prototype.getSnippet = function getSnippet(indent, maxLength) {
    var head, start, tail, end, snippet;

    if (!this.buffer) { return null; }

    indent = indent || 4;
    maxLength = maxLength || 75;

    head = '';
    start = this.position;

    while (start > 0 && '\x00\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(start - 1)) === -1) {
      start -= 1;
      if (this.position - start > (maxLength / 2 - 1)) {
        head = ' ... ';
        start += 5;
        break;
      }
    }

    tail = '';
    end = this.position;

    while (end < this.buffer.length && '\x00\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(end)) === -1) {
      end += 1;
      if (end - this.position > (maxLength / 2 - 1)) {
        tail = ' ... ';
        end -= 5;
        break;
      }
    }

    snippet = this.buffer.slice(start, end);

    return common.repeat(' ', indent) + head + snippet + tail + '\n' +
           common.repeat(' ', indent + this.position - start + head.length) + '^';
  };


  Mark.prototype.toString = function toString(compact) {
    var snippet, where = '';

    if (this.name) {
      where += 'in "' + this.name + '" ';
    }

    where += 'at line ' + (this.line + 1) + ', column ' + (this.column + 1);

    if (!compact) {
      snippet = this.getSnippet();

      if (snippet) {
        where += ':\n' + snippet;
      }
    }

    return where;
  };


  var mark = Mark;

  var TYPE_CONSTRUCTOR_OPTIONS = [
    'kind',
    'resolve',
    'construct',
    'instanceOf',
    'predicate',
    'represent',
    'defaultStyle',
    'styleAliases'
  ];

  var YAML_NODE_KINDS = [
    'scalar',
    'sequence',
    'mapping'
  ];

  function compileStyleAliases(map) {
    var result = {};

    if (map !== null) {
      Object.keys(map).forEach(function (style) {
        map[style].forEach(function (alias) {
          result[String(alias)] = style;
        });
      });
    }

    return result;
  }

  function Type(tag, options) {
    options = options || {};

    Object.keys(options).forEach(function (name) {
      if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
        throw new exception$1('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
      }
    });

    // TODO: Add tag format check.
    this.tag          = tag;
    this.kind         = options['kind']         || null;
    this.resolve      = options['resolve']      || function () { return true; };
    this.construct    = options['construct']    || function (data) { return data; };
    this.instanceOf   = options['instanceOf']   || null;
    this.predicate    = options['predicate']    || null;
    this.represent    = options['represent']    || null;
    this.defaultStyle = options['defaultStyle'] || null;
    this.styleAliases = compileStyleAliases(options['styleAliases'] || null);

    if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
      throw new exception$1('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
    }
  }

  var type = Type;

  /*eslint-disable max-len*/






  function compileList(schema, name, result) {
    var exclude = [];

    schema.include.forEach(function (includedSchema) {
      result = compileList(includedSchema, name, result);
    });

    schema[name].forEach(function (currentType) {
      result.forEach(function (previousType, previousIndex) {
        if (previousType.tag === currentType.tag && previousType.kind === currentType.kind) {
          exclude.push(previousIndex);
        }
      });

      result.push(currentType);
    });

    return result.filter(function (type, index) {
      return exclude.indexOf(index) === -1;
    });
  }


  function compileMap(/* lists... */) {
    var arguments$1 = arguments;

    var result = {
          scalar: {},
          sequence: {},
          mapping: {},
          fallback: {}
        }, index, length;

    function collectType(type) {
      result[type.kind][type.tag] = result['fallback'][type.tag] = type;
    }

    for (index = 0, length = arguments.length; index < length; index += 1) {
      arguments$1[index].forEach(collectType);
    }
    return result;
  }


  function Schema(definition) {
    this.include  = definition.include  || [];
    this.implicit = definition.implicit || [];
    this.explicit = definition.explicit || [];

    this.implicit.forEach(function (type) {
      if (type.loadKind && type.loadKind !== 'scalar') {
        throw new exception$1('There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.');
      }
    });

    this.compiledImplicit = compileList(this, 'implicit', []);
    this.compiledExplicit = compileList(this, 'explicit', []);
    this.compiledTypeMap  = compileMap(this.compiledImplicit, this.compiledExplicit);
  }


  Schema.DEFAULT = null;


  Schema.create = function createSchema() {
    var schemas, types;

    switch (arguments.length) {
      case 1:
        schemas = Schema.DEFAULT;
        types = arguments[0];
        break;

      case 2:
        schemas = arguments[0];
        types = arguments[1];
        break;

      default:
        throw new exception$1('Wrong number of arguments for Schema.create function');
    }

    schemas = common.toArray(schemas);
    types = common.toArray(types);

    if (!schemas.every(function (schema) { return schema instanceof Schema; })) {
      throw new exception$1('Specified list of super schemas (or a single Schema object) contains a non-Schema object.');
    }

    if (!types.every(function (type$1) { return type$1 instanceof type; })) {
      throw new exception$1('Specified list of YAML types (or a single Type object) contains a non-Type object.');
    }

    return new Schema({
      include: schemas,
      explicit: types
    });
  };


  var schema = Schema;

  var str = new type('tag:yaml.org,2002:str', {
    kind: 'scalar',
    construct: function (data) { return data !== null ? data : ''; }
  });

  var seq = new type('tag:yaml.org,2002:seq', {
    kind: 'sequence',
    construct: function (data) { return data !== null ? data : []; }
  });

  var map = new type('tag:yaml.org,2002:map', {
    kind: 'mapping',
    construct: function (data) { return data !== null ? data : {}; }
  });

  var failsafe = new schema({
    explicit: [
      str,
      seq,
      map
    ]
  });

  function resolveYamlNull(data) {
    if (data === null) { return true; }

    var max = data.length;

    return (max === 1 && data === '~') ||
           (max === 4 && (data === 'null' || data === 'Null' || data === 'NULL'));
  }

  function constructYamlNull() {
    return null;
  }

  function isNull$1(object) {
    return object === null;
  }

  var _null = new type('tag:yaml.org,2002:null', {
    kind: 'scalar',
    resolve: resolveYamlNull,
    construct: constructYamlNull,
    predicate: isNull$1,
    represent: {
      canonical: function () { return '~';    },
      lowercase: function () { return 'null'; },
      uppercase: function () { return 'NULL'; },
      camelcase: function () { return 'Null'; }
    },
    defaultStyle: 'lowercase'
  });

  function resolveYamlBoolean(data) {
    if (data === null) { return false; }

    var max = data.length;

    return (max === 4 && (data === 'true' || data === 'True' || data === 'TRUE')) ||
           (max === 5 && (data === 'false' || data === 'False' || data === 'FALSE'));
  }

  function constructYamlBoolean(data) {
    return data === 'true' ||
           data === 'True' ||
           data === 'TRUE';
  }

  function isBoolean(object) {
    return Object.prototype.toString.call(object) === '[object Boolean]';
  }

  var bool = new type('tag:yaml.org,2002:bool', {
    kind: 'scalar',
    resolve: resolveYamlBoolean,
    construct: constructYamlBoolean,
    predicate: isBoolean,
    represent: {
      lowercase: function (object) { return object ? 'true' : 'false'; },
      uppercase: function (object) { return object ? 'TRUE' : 'FALSE'; },
      camelcase: function (object) { return object ? 'True' : 'False'; }
    },
    defaultStyle: 'lowercase'
  });

  function isHexCode(c) {
    return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) ||
           ((0x41/* A */ <= c) && (c <= 0x46/* F */)) ||
           ((0x61/* a */ <= c) && (c <= 0x66/* f */));
  }

  function isOctCode(c) {
    return ((0x30/* 0 */ <= c) && (c <= 0x37/* 7 */));
  }

  function isDecCode(c) {
    return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */));
  }

  function resolveYamlInteger(data) {
    if (data === null) { return false; }

    var max = data.length,
        index = 0,
        hasDigits = false,
        ch;

    if (!max) { return false; }

    ch = data[index];

    // sign
    if (ch === '-' || ch === '+') {
      ch = data[++index];
    }

    if (ch === '0') {
      // 0
      if (index + 1 === max) { return true; }
      ch = data[++index];

      // base 2, base 8, base 16

      if (ch === 'b') {
        // base 2
        index++;

        for (; index < max; index++) {
          ch = data[index];
          if (ch === '_') { continue; }
          if (ch !== '0' && ch !== '1') { return false; }
          hasDigits = true;
        }
        return hasDigits && ch !== '_';
      }


      if (ch === 'x') {
        // base 16
        index++;

        for (; index < max; index++) {
          ch = data[index];
          if (ch === '_') { continue; }
          if (!isHexCode(data.charCodeAt(index))) { return false; }
          hasDigits = true;
        }
        return hasDigits && ch !== '_';
      }

      // base 8
      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') { continue; }
        if (!isOctCode(data.charCodeAt(index))) { return false; }
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }

    // base 10 (except 0) or base 60

    // value should not start with `_`;
    if (ch === '_') { return false; }

    for (; index < max; index++) {
      ch = data[index];
      if (ch === '_') { continue; }
      if (ch === ':') { break; }
      if (!isDecCode(data.charCodeAt(index))) {
        return false;
      }
      hasDigits = true;
    }

    // Should have digits and should not end with `_`
    if (!hasDigits || ch === '_') { return false; }

    // if !base60 - done;
    if (ch !== ':') { return true; }

    // base60 almost not used, no needs to optimize
    return /^(:[0-5]?[0-9])+$/.test(data.slice(index));
  }

  function constructYamlInteger(data) {
    var value = data, sign = 1, ch, base, digits = [];

    if (value.indexOf('_') !== -1) {
      value = value.replace(/_/g, '');
    }

    ch = value[0];

    if (ch === '-' || ch === '+') {
      if (ch === '-') { sign = -1; }
      value = value.slice(1);
      ch = value[0];
    }

    if (value === '0') { return 0; }

    if (ch === '0') {
      if (value[1] === 'b') { return sign * parseInt(value.slice(2), 2); }
      if (value[1] === 'x') { return sign * parseInt(value, 16); }
      return sign * parseInt(value, 8);
    }

    if (value.indexOf(':') !== -1) {
      value.split(':').forEach(function (v) {
        digits.unshift(parseInt(v, 10));
      });

      value = 0;
      base = 1;

      digits.forEach(function (d) {
        value += (d * base);
        base *= 60;
      });

      return sign * value;

    }

    return sign * parseInt(value, 10);
  }

  function isInteger(object) {
    return (Object.prototype.toString.call(object)) === '[object Number]' &&
           (object % 1 === 0 && !common.isNegativeZero(object));
  }

  var int_1 = new type('tag:yaml.org,2002:int', {
    kind: 'scalar',
    resolve: resolveYamlInteger,
    construct: constructYamlInteger,
    predicate: isInteger,
    represent: {
      binary:      function (obj) { return obj >= 0 ? '0b' + obj.toString(2) : '-0b' + obj.toString(2).slice(1); },
      octal:       function (obj) { return obj >= 0 ? '0'  + obj.toString(8) : '-0'  + obj.toString(8).slice(1); },
      decimal:     function (obj) { return obj.toString(10); },
      /* eslint-disable max-len */
      hexadecimal: function (obj) { return obj >= 0 ? '0x' + obj.toString(16).toUpperCase() :  '-0x' + obj.toString(16).toUpperCase().slice(1); }
    },
    defaultStyle: 'decimal',
    styleAliases: {
      binary:      [ 2,  'bin' ],
      octal:       [ 8,  'oct' ],
      decimal:     [ 10, 'dec' ],
      hexadecimal: [ 16, 'hex' ]
    }
  });

  var YAML_FLOAT_PATTERN = new RegExp(
    // 2.5e4, 2.5 and integers
    '^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?' +
    // .2e4, .2
    // special case, seems not from spec
    '|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?' +
    // 20:59
    '|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*' +
    // .inf
    '|[-+]?\\.(?:inf|Inf|INF)' +
    // .nan
    '|\\.(?:nan|NaN|NAN))$');

  function resolveYamlFloat(data) {
    if (data === null) { return false; }

    if (!YAML_FLOAT_PATTERN.test(data) ||
        // Quick hack to not allow integers end with `_`
        // Probably should update regexp & check speed
        data[data.length - 1] === '_') {
      return false;
    }

    return true;
  }

  function constructYamlFloat(data) {
    var value, sign, base, digits;

    value  = data.replace(/_/g, '').toLowerCase();
    sign   = value[0] === '-' ? -1 : 1;
    digits = [];

    if ('+-'.indexOf(value[0]) >= 0) {
      value = value.slice(1);
    }

    if (value === '.inf') {
      return (sign === 1) ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;

    } else if (value === '.nan') {
      return NaN;

    } else if (value.indexOf(':') >= 0) {
      value.split(':').forEach(function (v) {
        digits.unshift(parseFloat(v, 10));
      });

      value = 0.0;
      base = 1;

      digits.forEach(function (d) {
        value += d * base;
        base *= 60;
      });

      return sign * value;

    }
    return sign * parseFloat(value, 10);
  }


  var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;

  function representYamlFloat(object, style) {
    var res;

    if (isNaN(object)) {
      switch (style) {
        case 'lowercase': return '.nan';
        case 'uppercase': return '.NAN';
        case 'camelcase': return '.NaN';
      }
    } else if (Number.POSITIVE_INFINITY === object) {
      switch (style) {
        case 'lowercase': return '.inf';
        case 'uppercase': return '.INF';
        case 'camelcase': return '.Inf';
      }
    } else if (Number.NEGATIVE_INFINITY === object) {
      switch (style) {
        case 'lowercase': return '-.inf';
        case 'uppercase': return '-.INF';
        case 'camelcase': return '-.Inf';
      }
    } else if (common.isNegativeZero(object)) {
      return '-0.0';
    }

    res = object.toString(10);

    // JS stringifier can build scientific format without dots: 5e-100,
    // while YAML requres dot: 5.e-100. Fix it with simple hack

    return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace('e', '.e') : res;
  }

  function isFloat(object) {
    return (Object.prototype.toString.call(object) === '[object Number]') &&
           (object % 1 !== 0 || common.isNegativeZero(object));
  }

  var float_1 = new type('tag:yaml.org,2002:float', {
    kind: 'scalar',
    resolve: resolveYamlFloat,
    construct: constructYamlFloat,
    predicate: isFloat,
    represent: representYamlFloat,
    defaultStyle: 'lowercase'
  });

  var json = new schema({
    include: [
      failsafe
    ],
    implicit: [
      _null,
      bool,
      int_1,
      float_1
    ]
  });

  var core = new schema({
    include: [
      json
    ]
  });

  var YAML_DATE_REGEXP = new RegExp(
    '^([0-9][0-9][0-9][0-9])'          + // [1] year
    '-([0-9][0-9])'                    + // [2] month
    '-([0-9][0-9])$');                   // [3] day

  var YAML_TIMESTAMP_REGEXP = new RegExp(
    '^([0-9][0-9][0-9][0-9])'          + // [1] year
    '-([0-9][0-9]?)'                   + // [2] month
    '-([0-9][0-9]?)'                   + // [3] day
    '(?:[Tt]|[ \\t]+)'                 + // ...
    '([0-9][0-9]?)'                    + // [4] hour
    ':([0-9][0-9])'                    + // [5] minute
    ':([0-9][0-9])'                    + // [6] second
    '(?:\\.([0-9]*))?'                 + // [7] fraction
    '(?:[ \\t]*(Z|([-+])([0-9][0-9]?)' + // [8] tz [9] tz_sign [10] tz_hour
    '(?::([0-9][0-9]))?))?$');           // [11] tz_minute

  function resolveYamlTimestamp(data) {
    if (data === null) { return false; }
    if (YAML_DATE_REGEXP.exec(data) !== null) { return true; }
    if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) { return true; }
    return false;
  }

  function constructYamlTimestamp(data) {
    var match, year, month, day, hour, minute, second, fraction = 0,
        delta = null, tz_hour, tz_minute, date;

    match = YAML_DATE_REGEXP.exec(data);
    if (match === null) { match = YAML_TIMESTAMP_REGEXP.exec(data); }

    if (match === null) { throw new Error('Date resolve error'); }

    // match: [1] year [2] month [3] day

    year = +(match[1]);
    month = +(match[2]) - 1; // JS month starts with 0
    day = +(match[3]);

    if (!match[4]) { // no hour
      return new Date(Date.UTC(year, month, day));
    }

    // match: [4] hour [5] minute [6] second [7] fraction

    hour = +(match[4]);
    minute = +(match[5]);
    second = +(match[6]);

    if (match[7]) {
      fraction = match[7].slice(0, 3);
      while (fraction.length < 3) { // milli-seconds
        fraction += '0';
      }
      fraction = +fraction;
    }

    // match: [8] tz [9] tz_sign [10] tz_hour [11] tz_minute

    if (match[9]) {
      tz_hour = +(match[10]);
      tz_minute = +(match[11] || 0);
      delta = (tz_hour * 60 + tz_minute) * 60000; // delta in mili-seconds
      if (match[9] === '-') { delta = -delta; }
    }

    date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));

    if (delta) { date.setTime(date.getTime() - delta); }

    return date;
  }

  function representYamlTimestamp(object /*, style*/) {
    return object.toISOString();
  }

  var timestamp = new type('tag:yaml.org,2002:timestamp', {
    kind: 'scalar',
    resolve: resolveYamlTimestamp,
    construct: constructYamlTimestamp,
    instanceOf: Date,
    represent: representYamlTimestamp
  });

  function resolveYamlMerge(data) {
    return data === '<<' || data === null;
  }

  var merge = new type('tag:yaml.org,2002:merge', {
    kind: 'scalar',
    resolve: resolveYamlMerge
  });

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
  }

  /*eslint-disable no-bitwise*/

  var NodeBuffer;

  try {
    // A trick for browserified version, to not include `Buffer` shim
    var _require = commonjsRequire;
    NodeBuffer = _require('buffer').Buffer;
  } catch (_) {}




  // [ 64, 65, 66 ] -> [ padding, CR, LF ]
  var BASE64_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r';


  function resolveYamlBinary(data) {
    if (data === null) { return false; }

    var code, idx, bitlen = 0, max = data.length, map = BASE64_MAP;

    // Convert one by one.
    for (idx = 0; idx < max; idx++) {
      code = map.indexOf(data.charAt(idx));

      // Skip CR/LF
      if (code > 64) { continue; }

      // Fail on illegal characters
      if (code < 0) { return false; }

      bitlen += 6;
    }

    // If there are any bits left, source was corrupted
    return (bitlen % 8) === 0;
  }

  function constructYamlBinary(data) {
    var idx, tailbits,
        input = data.replace(/[\r\n=]/g, ''), // remove CR/LF & padding to simplify scan
        max = input.length,
        map = BASE64_MAP,
        bits = 0,
        result = [];

    // Collect by 6*4 bits (3 bytes)

    for (idx = 0; idx < max; idx++) {
      if ((idx % 4 === 0) && idx) {
        result.push((bits >> 16) & 0xFF);
        result.push((bits >> 8) & 0xFF);
        result.push(bits & 0xFF);
      }

      bits = (bits << 6) | map.indexOf(input.charAt(idx));
    }

    // Dump tail

    tailbits = (max % 4) * 6;

    if (tailbits === 0) {
      result.push((bits >> 16) & 0xFF);
      result.push((bits >> 8) & 0xFF);
      result.push(bits & 0xFF);
    } else if (tailbits === 18) {
      result.push((bits >> 10) & 0xFF);
      result.push((bits >> 2) & 0xFF);
    } else if (tailbits === 12) {
      result.push((bits >> 4) & 0xFF);
    }

    // Wrap into Buffer for NodeJS and leave Array for browser
    if (NodeBuffer) {
      // Support node 6.+ Buffer API when available
      return NodeBuffer.from ? NodeBuffer.from(result) : new NodeBuffer(result);
    }

    return result;
  }

  function representYamlBinary(object /*, style*/) {
    var result = '', bits = 0, idx, tail,
        max = object.length,
        map = BASE64_MAP;

    // Convert every three bytes to 4 ASCII characters.

    for (idx = 0; idx < max; idx++) {
      if ((idx % 3 === 0) && idx) {
        result += map[(bits >> 18) & 0x3F];
        result += map[(bits >> 12) & 0x3F];
        result += map[(bits >> 6) & 0x3F];
        result += map[bits & 0x3F];
      }

      bits = (bits << 8) + object[idx];
    }

    // Dump tail

    tail = max % 3;

    if (tail === 0) {
      result += map[(bits >> 18) & 0x3F];
      result += map[(bits >> 12) & 0x3F];
      result += map[(bits >> 6) & 0x3F];
      result += map[bits & 0x3F];
    } else if (tail === 2) {
      result += map[(bits >> 10) & 0x3F];
      result += map[(bits >> 4) & 0x3F];
      result += map[(bits << 2) & 0x3F];
      result += map[64];
    } else if (tail === 1) {
      result += map[(bits >> 2) & 0x3F];
      result += map[(bits << 4) & 0x3F];
      result += map[64];
      result += map[64];
    }

    return result;
  }

  function isBinary(object) {
    return NodeBuffer && NodeBuffer.isBuffer(object);
  }

  var binary = new type('tag:yaml.org,2002:binary', {
    kind: 'scalar',
    resolve: resolveYamlBinary,
    construct: constructYamlBinary,
    predicate: isBinary,
    represent: representYamlBinary
  });

  var _hasOwnProperty = Object.prototype.hasOwnProperty;
  var _toString       = Object.prototype.toString;

  function resolveYamlOmap(data) {
    if (data === null) { return true; }

    var objectKeys = [], index, length, pair, pairKey, pairHasKey,
        object = data;

    for (index = 0, length = object.length; index < length; index += 1) {
      pair = object[index];
      pairHasKey = false;

      if (_toString.call(pair) !== '[object Object]') { return false; }

      for (pairKey in pair) {
        if (_hasOwnProperty.call(pair, pairKey)) {
          if (!pairHasKey) { pairHasKey = true; }
          else { return false; }
        }
      }

      if (!pairHasKey) { return false; }

      if (objectKeys.indexOf(pairKey) === -1) { objectKeys.push(pairKey); }
      else { return false; }
    }

    return true;
  }

  function constructYamlOmap(data) {
    return data !== null ? data : [];
  }

  var omap = new type('tag:yaml.org,2002:omap', {
    kind: 'sequence',
    resolve: resolveYamlOmap,
    construct: constructYamlOmap
  });

  var _toString$1 = Object.prototype.toString;

  function resolveYamlPairs(data) {
    if (data === null) { return true; }

    var index, length, pair, keys, result,
        object = data;

    result = new Array(object.length);

    for (index = 0, length = object.length; index < length; index += 1) {
      pair = object[index];

      if (_toString$1.call(pair) !== '[object Object]') { return false; }

      keys = Object.keys(pair);

      if (keys.length !== 1) { return false; }

      result[index] = [ keys[0], pair[keys[0]] ];
    }

    return true;
  }

  function constructYamlPairs(data) {
    if (data === null) { return []; }

    var index, length, pair, keys, result,
        object = data;

    result = new Array(object.length);

    for (index = 0, length = object.length; index < length; index += 1) {
      pair = object[index];

      keys = Object.keys(pair);

      result[index] = [ keys[0], pair[keys[0]] ];
    }

    return result;
  }

  var pairs = new type('tag:yaml.org,2002:pairs', {
    kind: 'sequence',
    resolve: resolveYamlPairs,
    construct: constructYamlPairs
  });

  var _hasOwnProperty$1 = Object.prototype.hasOwnProperty;

  function resolveYamlSet(data) {
    if (data === null) { return true; }

    var key, object = data;

    for (key in object) {
      if (_hasOwnProperty$1.call(object, key)) {
        if (object[key] !== null) { return false; }
      }
    }

    return true;
  }

  function constructYamlSet(data) {
    return data !== null ? data : {};
  }

  var set$2 = new type('tag:yaml.org,2002:set', {
    kind: 'mapping',
    resolve: resolveYamlSet,
    construct: constructYamlSet
  });

  var default_safe = new schema({
    include: [
      core
    ],
    implicit: [
      timestamp,
      merge
    ],
    explicit: [
      binary,
      omap,
      pairs,
      set$2
    ]
  });

  function resolveJavascriptUndefined() {
    return true;
  }

  function constructJavascriptUndefined() {
    /*eslint-disable no-undefined*/
    return undefined;
  }

  function representJavascriptUndefined() {
    return '';
  }

  function isUndefined(object) {
    return typeof object === 'undefined';
  }

  var _undefined = new type('tag:yaml.org,2002:js/undefined', {
    kind: 'scalar',
    resolve: resolveJavascriptUndefined,
    construct: constructJavascriptUndefined,
    predicate: isUndefined,
    represent: representJavascriptUndefined
  });

  function resolveJavascriptRegExp(data) {
    if (data === null) { return false; }
    if (data.length === 0) { return false; }

    var regexp = data,
        tail   = /\/([gim]*)$/.exec(data),
        modifiers = '';

    // if regexp starts with '/' it can have modifiers and must be properly closed
    // `/foo/gim` - modifiers tail can be maximum 3 chars
    if (regexp[0] === '/') {
      if (tail) { modifiers = tail[1]; }

      if (modifiers.length > 3) { return false; }
      // if expression starts with /, is should be properly terminated
      if (regexp[regexp.length - modifiers.length - 1] !== '/') { return false; }
    }

    return true;
  }

  function constructJavascriptRegExp(data) {
    var regexp = data,
        tail   = /\/([gim]*)$/.exec(data),
        modifiers = '';

    // `/foo/gim` - tail can be maximum 4 chars
    if (regexp[0] === '/') {
      if (tail) { modifiers = tail[1]; }
      regexp = regexp.slice(1, regexp.length - modifiers.length - 1);
    }

    return new RegExp(regexp, modifiers);
  }

  function representJavascriptRegExp(object /*, style*/) {
    var result = '/' + object.source + '/';

    if (object.global) { result += 'g'; }
    if (object.multiline) { result += 'm'; }
    if (object.ignoreCase) { result += 'i'; }

    return result;
  }

  function isRegExp(object) {
    return Object.prototype.toString.call(object) === '[object RegExp]';
  }

  var regexp = new type('tag:yaml.org,2002:js/regexp', {
    kind: 'scalar',
    resolve: resolveJavascriptRegExp,
    construct: constructJavascriptRegExp,
    predicate: isRegExp,
    represent: representJavascriptRegExp
  });

  var esprima;

  // Browserified version does not have esprima
  //
  // 1. For node.js just require module as deps
  // 2. For browser try to require mudule via external AMD system.
  //    If not found - try to fallback to window.esprima. If not
  //    found too - then fail to parse.
  //
  try {
    // workaround to exclude package from browserify list.
    var _require$1 = commonjsRequire;
    esprima = _require$1('esprima');
  } catch (_) {
    /*global window */
    if (typeof window !== 'undefined') { esprima = window.esprima; }
  }



  function resolveJavascriptFunction(data) {
    if (data === null) { return false; }

    try {
      var source = '(' + data + ')',
          ast    = esprima.parse(source, { range: true });

      if (ast.type                    !== 'Program'             ||
          ast.body.length             !== 1                     ||
          ast.body[0].type            !== 'ExpressionStatement' ||
          (ast.body[0].expression.type !== 'ArrowFunctionExpression' &&
            ast.body[0].expression.type !== 'FunctionExpression')) {
        return false;
      }

      return true;
    } catch (err) {
      return false;
    }
  }

  function constructJavascriptFunction(data) {
    /*jslint evil:true*/

    var source = '(' + data + ')',
        ast    = esprima.parse(source, { range: true }),
        params = [],
        body;

    if (ast.type                    !== 'Program'             ||
        ast.body.length             !== 1                     ||
        ast.body[0].type            !== 'ExpressionStatement' ||
        (ast.body[0].expression.type !== 'ArrowFunctionExpression' &&
          ast.body[0].expression.type !== 'FunctionExpression')) {
      throw new Error('Failed to resolve function');
    }

    ast.body[0].expression.params.forEach(function (param) {
      params.push(param.name);
    });

    body = ast.body[0].expression.body.range;

    // Esprima's ranges include the first '{' and the last '}' characters on
    // function expressions. So cut them out.
    if (ast.body[0].expression.body.type === 'BlockStatement') {
      /*eslint-disable no-new-func*/
      return new Function(params, source.slice(body[0] + 1, body[1] - 1));
    }
    // ES6 arrow functions can omit the BlockStatement. In that case, just return
    // the body.
    /*eslint-disable no-new-func*/
    return new Function(params, 'return ' + source.slice(body[0], body[1]));
  }

  function representJavascriptFunction(object /*, style*/) {
    return object.toString();
  }

  function isFunction(object) {
    return Object.prototype.toString.call(object) === '[object Function]';
  }

  var _function = new type('tag:yaml.org,2002:js/function', {
    kind: 'scalar',
    resolve: resolveJavascriptFunction,
    construct: constructJavascriptFunction,
    predicate: isFunction,
    represent: representJavascriptFunction
  });

  var default_full = schema.DEFAULT = new schema({
    include: [
      default_safe
    ],
    explicit: [
      _undefined,
      regexp,
      _function
    ]
  });

  /*eslint-disable max-len,no-use-before-define*/








  var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;


  var CONTEXT_FLOW_IN   = 1;
  var CONTEXT_FLOW_OUT  = 2;
  var CONTEXT_BLOCK_IN  = 3;
  var CONTEXT_BLOCK_OUT = 4;


  var CHOMPING_CLIP  = 1;
  var CHOMPING_STRIP = 2;
  var CHOMPING_KEEP  = 3;


  var PATTERN_NON_PRINTABLE         = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
  var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
  var PATTERN_FLOW_INDICATORS       = /[,\[\]\{\}]/;
  var PATTERN_TAG_HANDLE            = /^(?:!|!!|![a-z\-]+!)$/i;
  var PATTERN_TAG_URI               = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;


  function _class(obj) { return Object.prototype.toString.call(obj); }

  function is_EOL(c) {
    return (c === 0x0A/* LF */) || (c === 0x0D/* CR */);
  }

  function is_WHITE_SPACE(c) {
    return (c === 0x09/* Tab */) || (c === 0x20/* Space */);
  }

  function is_WS_OR_EOL(c) {
    return (c === 0x09/* Tab */) ||
           (c === 0x20/* Space */) ||
           (c === 0x0A/* LF */) ||
           (c === 0x0D/* CR */);
  }

  function is_FLOW_INDICATOR(c) {
    return c === 0x2C/* , */ ||
           c === 0x5B/* [ */ ||
           c === 0x5D/* ] */ ||
           c === 0x7B/* { */ ||
           c === 0x7D/* } */;
  }

  function fromHexCode(c) {
    var lc;

    if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
      return c - 0x30;
    }

    /*eslint-disable no-bitwise*/
    lc = c | 0x20;

    if ((0x61/* a */ <= lc) && (lc <= 0x66/* f */)) {
      return lc - 0x61 + 10;
    }

    return -1;
  }

  function escapedHexLen(c) {
    if (c === 0x78/* x */) { return 2; }
    if (c === 0x75/* u */) { return 4; }
    if (c === 0x55/* U */) { return 8; }
    return 0;
  }

  function fromDecimalCode(c) {
    if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
      return c - 0x30;
    }

    return -1;
  }

  function simpleEscapeSequence(c) {
    /* eslint-disable indent */
    return (c === 0x30/* 0 */) ? '\x00' :
          (c === 0x61/* a */) ? '\x07' :
          (c === 0x62/* b */) ? '\x08' :
          (c === 0x74/* t */) ? '\x09' :
          (c === 0x09/* Tab */) ? '\x09' :
          (c === 0x6E/* n */) ? '\x0A' :
          (c === 0x76/* v */) ? '\x0B' :
          (c === 0x66/* f */) ? '\x0C' :
          (c === 0x72/* r */) ? '\x0D' :
          (c === 0x65/* e */) ? '\x1B' :
          (c === 0x20/* Space */) ? ' ' :
          (c === 0x22/* " */) ? '\x22' :
          (c === 0x2F/* / */) ? '/' :
          (c === 0x5C/* \ */) ? '\x5C' :
          (c === 0x4E/* N */) ? '\x85' :
          (c === 0x5F/* _ */) ? '\xA0' :
          (c === 0x4C/* L */) ? '\u2028' :
          (c === 0x50/* P */) ? '\u2029' : '';
  }

  function charFromCodepoint(c) {
    if (c <= 0xFFFF) {
      return String.fromCharCode(c);
    }
    // Encode UTF-16 surrogate pair
    // https://en.wikipedia.org/wiki/UTF-16#Code_points_U.2B010000_to_U.2B10FFFF
    return String.fromCharCode(
      ((c - 0x010000) >> 10) + 0xD800,
      ((c - 0x010000) & 0x03FF) + 0xDC00
    );
  }

  var simpleEscapeCheck = new Array(256); // integer, for fast access
  var simpleEscapeMap = new Array(256);
  for (var i = 0; i < 256; i++) {
    simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
    simpleEscapeMap[i] = simpleEscapeSequence(i);
  }


  function State(input, options) {
    this.input = input;

    this.filename  = options['filename']  || null;
    this.schema    = options['schema']    || default_full;
    this.onWarning = options['onWarning'] || null;
    this.legacy    = options['legacy']    || false;
    this.json      = options['json']      || false;
    this.listener  = options['listener']  || null;

    this.implicitTypes = this.schema.compiledImplicit;
    this.typeMap       = this.schema.compiledTypeMap;

    this.length     = input.length;
    this.position   = 0;
    this.line       = 0;
    this.lineStart  = 0;
    this.lineIndent = 0;

    this.documents = [];

    /*
    this.version;
    this.checkLineBreaks;
    this.tagMap;
    this.anchorMap;
    this.tag;
    this.anchor;
    this.kind;
    this.result;*/

  }


  function generateError(state, message) {
    return new exception$1(
      message,
      new mark(state.filename, state.input, state.position, state.line, (state.position - state.lineStart)));
  }

  function throwError(state, message) {
    throw generateError(state, message);
  }

  function throwWarning(state, message) {
    if (state.onWarning) {
      state.onWarning.call(null, generateError(state, message));
    }
  }


  var directiveHandlers = {

    YAML: function handleYamlDirective(state, name, args) {

      var match, major, minor;

      if (state.version !== null) {
        throwError(state, 'duplication of %YAML directive');
      }

      if (args.length !== 1) {
        throwError(state, 'YAML directive accepts exactly one argument');
      }

      match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);

      if (match === null) {
        throwError(state, 'ill-formed argument of the YAML directive');
      }

      major = parseInt(match[1], 10);
      minor = parseInt(match[2], 10);

      if (major !== 1) {
        throwError(state, 'unacceptable YAML version of the document');
      }

      state.version = args[0];
      state.checkLineBreaks = (minor < 2);

      if (minor !== 1 && minor !== 2) {
        throwWarning(state, 'unsupported YAML version of the document');
      }
    },

    TAG: function handleTagDirective(state, name, args) {

      var handle, prefix;

      if (args.length !== 2) {
        throwError(state, 'TAG directive accepts exactly two arguments');
      }

      handle = args[0];
      prefix = args[1];

      if (!PATTERN_TAG_HANDLE.test(handle)) {
        throwError(state, 'ill-formed tag handle (first argument) of the TAG directive');
      }

      if (_hasOwnProperty$2.call(state.tagMap, handle)) {
        throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
      }

      if (!PATTERN_TAG_URI.test(prefix)) {
        throwError(state, 'ill-formed tag prefix (second argument) of the TAG directive');
      }

      state.tagMap[handle] = prefix;
    }
  };


  function captureSegment(state, start, end, checkJson) {
    var _position, _length, _character, _result;

    if (start < end) {
      _result = state.input.slice(start, end);

      if (checkJson) {
        for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
          _character = _result.charCodeAt(_position);
          if (!(_character === 0x09 ||
                (0x20 <= _character && _character <= 0x10FFFF))) {
            throwError(state, 'expected valid JSON character');
          }
        }
      } else if (PATTERN_NON_PRINTABLE.test(_result)) {
        throwError(state, 'the stream contains non-printable characters');
      }

      state.result += _result;
    }
  }

  function mergeMappings(state, destination, source, overridableKeys) {
    var sourceKeys, key, index, quantity;

    if (!common.isObject(source)) {
      throwError(state, 'cannot merge mappings; the provided source object is unacceptable');
    }

    sourceKeys = Object.keys(source);

    for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
      key = sourceKeys[index];

      if (!_hasOwnProperty$2.call(destination, key)) {
        destination[key] = source[key];
        overridableKeys[key] = true;
      }
    }
  }

  function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startPos) {
    var index, quantity;

    // The output is a plain object here, so keys can only be strings.
    // We need to convert keyNode to a string, but doing so can hang the process
    // (deeply nested arrays that explode exponentially using aliases).
    if (Array.isArray(keyNode)) {
      keyNode = Array.prototype.slice.call(keyNode);

      for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
        if (Array.isArray(keyNode[index])) {
          throwError(state, 'nested arrays are not supported inside keys');
        }

        if (typeof keyNode === 'object' && _class(keyNode[index]) === '[object Object]') {
          keyNode[index] = '[object Object]';
        }
      }
    }

    // Avoid code execution in load() via toString property
    // (still use its own toString for arrays, timestamps,
    // and whatever user schema extensions happen to have @@toStringTag)
    if (typeof keyNode === 'object' && _class(keyNode) === '[object Object]') {
      keyNode = '[object Object]';
    }


    keyNode = String(keyNode);

    if (_result === null) {
      _result = {};
    }

    if (keyTag === 'tag:yaml.org,2002:merge') {
      if (Array.isArray(valueNode)) {
        for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
          mergeMappings(state, _result, valueNode[index], overridableKeys);
        }
      } else {
        mergeMappings(state, _result, valueNode, overridableKeys);
      }
    } else {
      if (!state.json &&
          !_hasOwnProperty$2.call(overridableKeys, keyNode) &&
          _hasOwnProperty$2.call(_result, keyNode)) {
        state.line = startLine || state.line;
        state.position = startPos || state.position;
        throwError(state, 'duplicated mapping key');
      }
      _result[keyNode] = valueNode;
      delete overridableKeys[keyNode];
    }

    return _result;
  }

  function readLineBreak(state) {
    var ch;

    ch = state.input.charCodeAt(state.position);

    if (ch === 0x0A/* LF */) {
      state.position++;
    } else if (ch === 0x0D/* CR */) {
      state.position++;
      if (state.input.charCodeAt(state.position) === 0x0A/* LF */) {
        state.position++;
      }
    } else {
      throwError(state, 'a line break is expected');
    }

    state.line += 1;
    state.lineStart = state.position;
  }

  function skipSeparationSpace(state, allowComments, checkIndent) {
    var lineBreaks = 0,
        ch = state.input.charCodeAt(state.position);

    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      if (allowComments && ch === 0x23/* # */) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0x0A/* LF */ && ch !== 0x0D/* CR */ && ch !== 0);
      }

      if (is_EOL(ch)) {
        readLineBreak(state);

        ch = state.input.charCodeAt(state.position);
        lineBreaks++;
        state.lineIndent = 0;

        while (ch === 0x20/* Space */) {
          state.lineIndent++;
          ch = state.input.charCodeAt(++state.position);
        }
      } else {
        break;
      }
    }

    if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
      throwWarning(state, 'deficient indentation');
    }

    return lineBreaks;
  }

  function testDocumentSeparator(state) {
    var _position = state.position,
        ch;

    ch = state.input.charCodeAt(_position);

    // Condition state.position === state.lineStart is tested
    // in parent on each call, for efficiency. No needs to test here again.
    if ((ch === 0x2D/* - */ || ch === 0x2E/* . */) &&
        ch === state.input.charCodeAt(_position + 1) &&
        ch === state.input.charCodeAt(_position + 2)) {

      _position += 3;

      ch = state.input.charCodeAt(_position);

      if (ch === 0 || is_WS_OR_EOL(ch)) {
        return true;
      }
    }

    return false;
  }

  function writeFoldedLines(state, count) {
    if (count === 1) {
      state.result += ' ';
    } else if (count > 1) {
      state.result += common.repeat('\n', count - 1);
    }
  }


  function readPlainScalar(state, nodeIndent, withinFlowCollection) {
    var preceding,
        following,
        captureStart,
        captureEnd,
        hasPendingContent,
        _line,
        _lineStart,
        _lineIndent,
        _kind = state.kind,
        _result = state.result,
        ch;

    ch = state.input.charCodeAt(state.position);

    if (is_WS_OR_EOL(ch)      ||
        is_FLOW_INDICATOR(ch) ||
        ch === 0x23/* # */    ||
        ch === 0x26/* & */    ||
        ch === 0x2A/* * */    ||
        ch === 0x21/* ! */    ||
        ch === 0x7C/* | */    ||
        ch === 0x3E/* > */    ||
        ch === 0x27/* ' */    ||
        ch === 0x22/* " */    ||
        ch === 0x25/* % */    ||
        ch === 0x40/* @ */    ||
        ch === 0x60/* ` */) {
      return false;
    }

    if (ch === 0x3F/* ? */ || ch === 0x2D/* - */) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following) ||
          withinFlowCollection && is_FLOW_INDICATOR(following)) {
        return false;
      }
    }

    state.kind = 'scalar';
    state.result = '';
    captureStart = captureEnd = state.position;
    hasPendingContent = false;

    while (ch !== 0) {
      if (ch === 0x3A/* : */) {
        following = state.input.charCodeAt(state.position + 1);

        if (is_WS_OR_EOL(following) ||
            withinFlowCollection && is_FLOW_INDICATOR(following)) {
          break;
        }

      } else if (ch === 0x23/* # */) {
        preceding = state.input.charCodeAt(state.position - 1);

        if (is_WS_OR_EOL(preceding)) {
          break;
        }

      } else if ((state.position === state.lineStart && testDocumentSeparator(state)) ||
                 withinFlowCollection && is_FLOW_INDICATOR(ch)) {
        break;

      } else if (is_EOL(ch)) {
        _line = state.line;
        _lineStart = state.lineStart;
        _lineIndent = state.lineIndent;
        skipSeparationSpace(state, false, -1);

        if (state.lineIndent >= nodeIndent) {
          hasPendingContent = true;
          ch = state.input.charCodeAt(state.position);
          continue;
        } else {
          state.position = captureEnd;
          state.line = _line;
          state.lineStart = _lineStart;
          state.lineIndent = _lineIndent;
          break;
        }
      }

      if (hasPendingContent) {
        captureSegment(state, captureStart, captureEnd, false);
        writeFoldedLines(state, state.line - _line);
        captureStart = captureEnd = state.position;
        hasPendingContent = false;
      }

      if (!is_WHITE_SPACE(ch)) {
        captureEnd = state.position + 1;
      }

      ch = state.input.charCodeAt(++state.position);
    }

    captureSegment(state, captureStart, captureEnd, false);

    if (state.result) {
      return true;
    }

    state.kind = _kind;
    state.result = _result;
    return false;
  }

  function readSingleQuotedScalar(state, nodeIndent) {
    var ch,
        captureStart, captureEnd;

    ch = state.input.charCodeAt(state.position);

    if (ch !== 0x27/* ' */) {
      return false;
    }

    state.kind = 'scalar';
    state.result = '';
    state.position++;
    captureStart = captureEnd = state.position;

    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      if (ch === 0x27/* ' */) {
        captureSegment(state, captureStart, state.position, true);
        ch = state.input.charCodeAt(++state.position);

        if (ch === 0x27/* ' */) {
          captureStart = state.position;
          state.position++;
          captureEnd = state.position;
        } else {
          return true;
        }

      } else if (is_EOL(ch)) {
        captureSegment(state, captureStart, captureEnd, true);
        writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
        captureStart = captureEnd = state.position;

      } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
        throwError(state, 'unexpected end of the document within a single quoted scalar');

      } else {
        state.position++;
        captureEnd = state.position;
      }
    }

    throwError(state, 'unexpected end of the stream within a single quoted scalar');
  }

  function readDoubleQuotedScalar(state, nodeIndent) {
    var captureStart,
        captureEnd,
        hexLength,
        hexResult,
        tmp,
        ch;

    ch = state.input.charCodeAt(state.position);

    if (ch !== 0x22/* " */) {
      return false;
    }

    state.kind = 'scalar';
    state.result = '';
    state.position++;
    captureStart = captureEnd = state.position;

    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      if (ch === 0x22/* " */) {
        captureSegment(state, captureStart, state.position, true);
        state.position++;
        return true;

      } else if (ch === 0x5C/* \ */) {
        captureSegment(state, captureStart, state.position, true);
        ch = state.input.charCodeAt(++state.position);

        if (is_EOL(ch)) {
          skipSeparationSpace(state, false, nodeIndent);

          // TODO: rework to inline fn with no type cast?
        } else if (ch < 256 && simpleEscapeCheck[ch]) {
          state.result += simpleEscapeMap[ch];
          state.position++;

        } else if ((tmp = escapedHexLen(ch)) > 0) {
          hexLength = tmp;
          hexResult = 0;

          for (; hexLength > 0; hexLength--) {
            ch = state.input.charCodeAt(++state.position);

            if ((tmp = fromHexCode(ch)) >= 0) {
              hexResult = (hexResult << 4) + tmp;

            } else {
              throwError(state, 'expected hexadecimal character');
            }
          }

          state.result += charFromCodepoint(hexResult);

          state.position++;

        } else {
          throwError(state, 'unknown escape sequence');
        }

        captureStart = captureEnd = state.position;

      } else if (is_EOL(ch)) {
        captureSegment(state, captureStart, captureEnd, true);
        writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
        captureStart = captureEnd = state.position;

      } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
        throwError(state, 'unexpected end of the document within a double quoted scalar');

      } else {
        state.position++;
        captureEnd = state.position;
      }
    }

    throwError(state, 'unexpected end of the stream within a double quoted scalar');
  }

  function readFlowCollection(state, nodeIndent) {
    var readNext = true,
        _line,
        _tag     = state.tag,
        _result,
        _anchor  = state.anchor,
        following,
        terminator,
        isPair,
        isExplicitPair,
        isMapping,
        overridableKeys = {},
        keyNode,
        keyTag,
        valueNode,
        ch;

    ch = state.input.charCodeAt(state.position);

    if (ch === 0x5B/* [ */) {
      terminator = 0x5D;/* ] */
      isMapping = false;
      _result = [];
    } else if (ch === 0x7B/* { */) {
      terminator = 0x7D;/* } */
      isMapping = true;
      _result = {};
    } else {
      return false;
    }

    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }

    ch = state.input.charCodeAt(++state.position);

    while (ch !== 0) {
      skipSeparationSpace(state, true, nodeIndent);

      ch = state.input.charCodeAt(state.position);

      if (ch === terminator) {
        state.position++;
        state.tag = _tag;
        state.anchor = _anchor;
        state.kind = isMapping ? 'mapping' : 'sequence';
        state.result = _result;
        return true;
      } else if (!readNext) {
        throwError(state, 'missed comma between flow collection entries');
      }

      keyTag = keyNode = valueNode = null;
      isPair = isExplicitPair = false;

      if (ch === 0x3F/* ? */) {
        following = state.input.charCodeAt(state.position + 1);

        if (is_WS_OR_EOL(following)) {
          isPair = isExplicitPair = true;
          state.position++;
          skipSeparationSpace(state, true, nodeIndent);
        }
      }

      _line = state.line;
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      keyTag = state.tag;
      keyNode = state.result;
      skipSeparationSpace(state, true, nodeIndent);

      ch = state.input.charCodeAt(state.position);

      if ((isExplicitPair || state.line === _line) && ch === 0x3A/* : */) {
        isPair = true;
        ch = state.input.charCodeAt(++state.position);
        skipSeparationSpace(state, true, nodeIndent);
        composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
        valueNode = state.result;
      }

      if (isMapping) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode);
      } else if (isPair) {
        _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode));
      } else {
        _result.push(keyNode);
      }

      skipSeparationSpace(state, true, nodeIndent);

      ch = state.input.charCodeAt(state.position);

      if (ch === 0x2C/* , */) {
        readNext = true;
        ch = state.input.charCodeAt(++state.position);
      } else {
        readNext = false;
      }
    }

    throwError(state, 'unexpected end of the stream within a flow collection');
  }

  function readBlockScalar(state, nodeIndent) {
    var captureStart,
        folding,
        chomping       = CHOMPING_CLIP,
        didReadContent = false,
        detectedIndent = false,
        textIndent     = nodeIndent,
        emptyLines     = 0,
        atMoreIndented = false,
        tmp,
        ch;

    ch = state.input.charCodeAt(state.position);

    if (ch === 0x7C/* | */) {
      folding = false;
    } else if (ch === 0x3E/* > */) {
      folding = true;
    } else {
      return false;
    }

    state.kind = 'scalar';
    state.result = '';

    while (ch !== 0) {
      ch = state.input.charCodeAt(++state.position);

      if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
        if (CHOMPING_CLIP === chomping) {
          chomping = (ch === 0x2B/* + */) ? CHOMPING_KEEP : CHOMPING_STRIP;
        } else {
          throwError(state, 'repeat of a chomping mode identifier');
        }

      } else if ((tmp = fromDecimalCode(ch)) >= 0) {
        if (tmp === 0) {
          throwError(state, 'bad explicit indentation width of a block scalar; it cannot be less than one');
        } else if (!detectedIndent) {
          textIndent = nodeIndent + tmp - 1;
          detectedIndent = true;
        } else {
          throwError(state, 'repeat of an indentation width identifier');
        }

      } else {
        break;
      }
    }

    if (is_WHITE_SPACE(ch)) {
      do { ch = state.input.charCodeAt(++state.position); }
      while (is_WHITE_SPACE(ch));

      if (ch === 0x23/* # */) {
        do { ch = state.input.charCodeAt(++state.position); }
        while (!is_EOL(ch) && (ch !== 0));
      }
    }

    while (ch !== 0) {
      readLineBreak(state);
      state.lineIndent = 0;

      ch = state.input.charCodeAt(state.position);

      while ((!detectedIndent || state.lineIndent < textIndent) &&
             (ch === 0x20/* Space */)) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }

      if (!detectedIndent && state.lineIndent > textIndent) {
        textIndent = state.lineIndent;
      }

      if (is_EOL(ch)) {
        emptyLines++;
        continue;
      }

      // End of the scalar.
      if (state.lineIndent < textIndent) {

        // Perform the chomping.
        if (chomping === CHOMPING_KEEP) {
          state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
        } else if (chomping === CHOMPING_CLIP) {
          if (didReadContent) { // i.e. only if the scalar is not empty.
            state.result += '\n';
          }
        }

        // Break this `while` cycle and go to the funciton's epilogue.
        break;
      }

      // Folded style: use fancy rules to handle line breaks.
      if (folding) {

        // Lines starting with white space characters (more-indented lines) are not folded.
        if (is_WHITE_SPACE(ch)) {
          atMoreIndented = true;
          // except for the first content line (cf. Example 8.1)
          state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);

        // End of more-indented block.
        } else if (atMoreIndented) {
          atMoreIndented = false;
          state.result += common.repeat('\n', emptyLines + 1);

        // Just one line break - perceive as the same line.
        } else if (emptyLines === 0) {
          if (didReadContent) { // i.e. only if we have already read some scalar content.
            state.result += ' ';
          }

        // Several line breaks - perceive as different lines.
        } else {
          state.result += common.repeat('\n', emptyLines);
        }

      // Literal style: just add exact number of line breaks between content lines.
      } else {
        // Keep all line breaks except the header line break.
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
      }

      didReadContent = true;
      detectedIndent = true;
      emptyLines = 0;
      captureStart = state.position;

      while (!is_EOL(ch) && (ch !== 0)) {
        ch = state.input.charCodeAt(++state.position);
      }

      captureSegment(state, captureStart, state.position, false);
    }

    return true;
  }

  function readBlockSequence(state, nodeIndent) {
    var _line,
        _tag      = state.tag,
        _anchor   = state.anchor,
        _result   = [],
        following,
        detected  = false,
        ch;

    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }

    ch = state.input.charCodeAt(state.position);

    while (ch !== 0) {

      if (ch !== 0x2D/* - */) {
        break;
      }

      following = state.input.charCodeAt(state.position + 1);

      if (!is_WS_OR_EOL(following)) {
        break;
      }

      detected = true;
      state.position++;

      if (skipSeparationSpace(state, true, -1)) {
        if (state.lineIndent <= nodeIndent) {
          _result.push(null);
          ch = state.input.charCodeAt(state.position);
          continue;
        }
      }

      _line = state.line;
      composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
      _result.push(state.result);
      skipSeparationSpace(state, true, -1);

      ch = state.input.charCodeAt(state.position);

      if ((state.line === _line || state.lineIndent > nodeIndent) && (ch !== 0)) {
        throwError(state, 'bad indentation of a sequence entry');
      } else if (state.lineIndent < nodeIndent) {
        break;
      }
    }

    if (detected) {
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = 'sequence';
      state.result = _result;
      return true;
    }
    return false;
  }

  function readBlockMapping(state, nodeIndent, flowIndent) {
    var following,
        allowCompact,
        _line,
        _pos,
        _tag          = state.tag,
        _anchor       = state.anchor,
        _result       = {},
        overridableKeys = {},
        keyTag        = null,
        keyNode       = null,
        valueNode     = null,
        atExplicitKey = false,
        detected      = false,
        ch;

    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }

    ch = state.input.charCodeAt(state.position);

    while (ch !== 0) {
      following = state.input.charCodeAt(state.position + 1);
      _line = state.line; // Save the current line.
      _pos = state.position;

      //
      // Explicit notation case. There are two separate blocks:
      // first for the key (denoted by "?") and second for the value (denoted by ":")
      //
      if ((ch === 0x3F/* ? */ || ch === 0x3A/* : */) && is_WS_OR_EOL(following)) {

        if (ch === 0x3F/* ? */) {
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
            keyTag = keyNode = valueNode = null;
          }

          detected = true;
          atExplicitKey = true;
          allowCompact = true;

        } else if (atExplicitKey) {
          // i.e. 0x3A/* : */ === character after the explicit key.
          atExplicitKey = false;
          allowCompact = true;

        } else {
          throwError(state, 'incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line');
        }

        state.position += 1;
        ch = following;

      //
      // Implicit notation case. Flow-style node as the key first, then ":", and the value.
      //
      } else if (composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {

        if (state.line === _line) {
          ch = state.input.charCodeAt(state.position);

          while (is_WHITE_SPACE(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }

          if (ch === 0x3A/* : */) {
            ch = state.input.charCodeAt(++state.position);

            if (!is_WS_OR_EOL(ch)) {
              throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');
            }

            if (atExplicitKey) {
              storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
              keyTag = keyNode = valueNode = null;
            }

            detected = true;
            atExplicitKey = false;
            allowCompact = false;
            keyTag = state.tag;
            keyNode = state.result;

          } else if (detected) {
            throwError(state, 'can not read an implicit mapping pair; a colon is missed');

          } else {
            state.tag = _tag;
            state.anchor = _anchor;
            return true; // Keep the result of `composeNode`.
          }

        } else if (detected) {
          throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');

        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true; // Keep the result of `composeNode`.
        }

      } else {
        break; // Reading is done. Go to the epilogue.
      }

      //
      // Common reading code for both explicit and implicit notations.
      //
      if (state.line === _line || state.lineIndent > nodeIndent) {
        if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
          if (atExplicitKey) {
            keyNode = state.result;
          } else {
            valueNode = state.result;
          }
        }

        if (!atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _pos);
          keyTag = keyNode = valueNode = null;
        }

        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
      }

      if (state.lineIndent > nodeIndent && (ch !== 0)) {
        throwError(state, 'bad indentation of a mapping entry');
      } else if (state.lineIndent < nodeIndent) {
        break;
      }
    }

    //
    // Epilogue.
    //

    // Special case: last mapping's node contains only the key in explicit notation.
    if (atExplicitKey) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
    }

    // Expose the resulting mapping.
    if (detected) {
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = 'mapping';
      state.result = _result;
    }

    return detected;
  }

  function readTagProperty(state) {
    var _position,
        isVerbatim = false,
        isNamed    = false,
        tagHandle,
        tagName,
        ch;

    ch = state.input.charCodeAt(state.position);

    if (ch !== 0x21/* ! */) { return false; }

    if (state.tag !== null) {
      throwError(state, 'duplication of a tag property');
    }

    ch = state.input.charCodeAt(++state.position);

    if (ch === 0x3C/* < */) {
      isVerbatim = true;
      ch = state.input.charCodeAt(++state.position);

    } else if (ch === 0x21/* ! */) {
      isNamed = true;
      tagHandle = '!!';
      ch = state.input.charCodeAt(++state.position);

    } else {
      tagHandle = '!';
    }

    _position = state.position;

    if (isVerbatim) {
      do { ch = state.input.charCodeAt(++state.position); }
      while (ch !== 0 && ch !== 0x3E/* > */);

      if (state.position < state.length) {
        tagName = state.input.slice(_position, state.position);
        ch = state.input.charCodeAt(++state.position);
      } else {
        throwError(state, 'unexpected end of the stream within a verbatim tag');
      }
    } else {
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {

        if (ch === 0x21/* ! */) {
          if (!isNamed) {
            tagHandle = state.input.slice(_position - 1, state.position + 1);

            if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
              throwError(state, 'named tag handle cannot contain such characters');
            }

            isNamed = true;
            _position = state.position + 1;
          } else {
            throwError(state, 'tag suffix cannot contain exclamation marks');
          }
        }

        ch = state.input.charCodeAt(++state.position);
      }

      tagName = state.input.slice(_position, state.position);

      if (PATTERN_FLOW_INDICATORS.test(tagName)) {
        throwError(state, 'tag suffix cannot contain flow indicator characters');
      }
    }

    if (tagName && !PATTERN_TAG_URI.test(tagName)) {
      throwError(state, 'tag name cannot contain such characters: ' + tagName);
    }

    if (isVerbatim) {
      state.tag = tagName;

    } else if (_hasOwnProperty$2.call(state.tagMap, tagHandle)) {
      state.tag = state.tagMap[tagHandle] + tagName;

    } else if (tagHandle === '!') {
      state.tag = '!' + tagName;

    } else if (tagHandle === '!!') {
      state.tag = 'tag:yaml.org,2002:' + tagName;

    } else {
      throwError(state, 'undeclared tag handle "' + tagHandle + '"');
    }

    return true;
  }

  function readAnchorProperty(state) {
    var _position,
        ch;

    ch = state.input.charCodeAt(state.position);

    if (ch !== 0x26/* & */) { return false; }

    if (state.anchor !== null) {
      throwError(state, 'duplication of an anchor property');
    }

    ch = state.input.charCodeAt(++state.position);
    _position = state.position;

    while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    if (state.position === _position) {
      throwError(state, 'name of an anchor node must contain at least one character');
    }

    state.anchor = state.input.slice(_position, state.position);
    return true;
  }

  function readAlias(state) {
    var _position, alias,
        ch;

    ch = state.input.charCodeAt(state.position);

    if (ch !== 0x2A/* * */) { return false; }

    ch = state.input.charCodeAt(++state.position);
    _position = state.position;

    while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    if (state.position === _position) {
      throwError(state, 'name of an alias node must contain at least one character');
    }

    alias = state.input.slice(_position, state.position);

    if (!state.anchorMap.hasOwnProperty(alias)) {
      throwError(state, 'unidentified alias "' + alias + '"');
    }

    state.result = state.anchorMap[alias];
    skipSeparationSpace(state, true, -1);
    return true;
  }

  function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
    var allowBlockStyles,
        allowBlockScalars,
        allowBlockCollections,
        indentStatus = 1, // 1: this>parent, 0: this=parent, -1: this<parent
        atNewLine  = false,
        hasContent = false,
        typeIndex,
        typeQuantity,
        type,
        flowIndent,
        blockIndent;

    if (state.listener !== null) {
      state.listener('open', state);
    }

    state.tag    = null;
    state.anchor = null;
    state.kind   = null;
    state.result = null;

    allowBlockStyles = allowBlockScalars = allowBlockCollections =
      CONTEXT_BLOCK_OUT === nodeContext ||
      CONTEXT_BLOCK_IN  === nodeContext;

    if (allowToSeek) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;

        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      }
    }

    if (indentStatus === 1) {
      while (readTagProperty(state) || readAnchorProperty(state)) {
        if (skipSeparationSpace(state, true, -1)) {
          atNewLine = true;
          allowBlockCollections = allowBlockStyles;

          if (state.lineIndent > parentIndent) {
            indentStatus = 1;
          } else if (state.lineIndent === parentIndent) {
            indentStatus = 0;
          } else if (state.lineIndent < parentIndent) {
            indentStatus = -1;
          }
        } else {
          allowBlockCollections = false;
        }
      }
    }

    if (allowBlockCollections) {
      allowBlockCollections = atNewLine || allowCompact;
    }

    if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
      if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
        flowIndent = parentIndent;
      } else {
        flowIndent = parentIndent + 1;
      }

      blockIndent = state.position - state.lineStart;

      if (indentStatus === 1) {
        if (allowBlockCollections &&
            (readBlockSequence(state, blockIndent) ||
             readBlockMapping(state, blockIndent, flowIndent)) ||
            readFlowCollection(state, flowIndent)) {
          hasContent = true;
        } else {
          if ((allowBlockScalars && readBlockScalar(state, flowIndent)) ||
              readSingleQuotedScalar(state, flowIndent) ||
              readDoubleQuotedScalar(state, flowIndent)) {
            hasContent = true;

          } else if (readAlias(state)) {
            hasContent = true;

            if (state.tag !== null || state.anchor !== null) {
              throwError(state, 'alias node should not have any properties');
            }

          } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
            hasContent = true;

            if (state.tag === null) {
              state.tag = '?';
            }
          }

          if (state.anchor !== null) {
            state.anchorMap[state.anchor] = state.result;
          }
        }
      } else if (indentStatus === 0) {
        // Special case: block sequences are allowed to have same indentation level as the parent.
        // http://www.yaml.org/spec/1.2/spec.html#id2799784
        hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
      }
    }

    if (state.tag !== null && state.tag !== '!') {
      if (state.tag === '?') {
        for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
          type = state.implicitTypes[typeIndex];

          // Implicit resolving is not allowed for non-scalar types, and '?'
          // non-specific tag is only assigned to plain scalars. So, it isn't
          // needed to check for 'kind' conformity.

          if (type.resolve(state.result)) { // `state.result` updated in resolver if matched
            state.result = type.construct(state.result);
            state.tag = type.tag;
            if (state.anchor !== null) {
              state.anchorMap[state.anchor] = state.result;
            }
            break;
          }
        }
      } else if (_hasOwnProperty$2.call(state.typeMap[state.kind || 'fallback'], state.tag)) {
        type = state.typeMap[state.kind || 'fallback'][state.tag];

        if (state.result !== null && type.kind !== state.kind) {
          throwError(state, 'unacceptable node kind for !<' + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
        }

        if (!type.resolve(state.result)) { // `state.result` updated in resolver if matched
          throwError(state, 'cannot resolve a node with !<' + state.tag + '> explicit tag');
        } else {
          state.result = type.construct(state.result);
          if (state.anchor !== null) {
            state.anchorMap[state.anchor] = state.result;
          }
        }
      } else {
        throwError(state, 'unknown tag !<' + state.tag + '>');
      }
    }

    if (state.listener !== null) {
      state.listener('close', state);
    }
    return state.tag !== null ||  state.anchor !== null || hasContent;
  }

  function readDocument(state) {
    var documentStart = state.position,
        _position,
        directiveName,
        directiveArgs,
        hasDirectives = false,
        ch;

    state.version = null;
    state.checkLineBreaks = state.legacy;
    state.tagMap = {};
    state.anchorMap = {};

    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      skipSeparationSpace(state, true, -1);

      ch = state.input.charCodeAt(state.position);

      if (state.lineIndent > 0 || ch !== 0x25/* % */) {
        break;
      }

      hasDirectives = true;
      ch = state.input.charCodeAt(++state.position);
      _position = state.position;

      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      directiveName = state.input.slice(_position, state.position);
      directiveArgs = [];

      if (directiveName.length < 1) {
        throwError(state, 'directive name must not be less than one character in length');
      }

      while (ch !== 0) {
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }

        if (ch === 0x23/* # */) {
          do { ch = state.input.charCodeAt(++state.position); }
          while (ch !== 0 && !is_EOL(ch));
          break;
        }

        if (is_EOL(ch)) { break; }

        _position = state.position;

        while (ch !== 0 && !is_WS_OR_EOL(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }

        directiveArgs.push(state.input.slice(_position, state.position));
      }

      if (ch !== 0) { readLineBreak(state); }

      if (_hasOwnProperty$2.call(directiveHandlers, directiveName)) {
        directiveHandlers[directiveName](state, directiveName, directiveArgs);
      } else {
        throwWarning(state, 'unknown document directive "' + directiveName + '"');
      }
    }

    skipSeparationSpace(state, true, -1);

    if (state.lineIndent === 0 &&
        state.input.charCodeAt(state.position)     === 0x2D/* - */ &&
        state.input.charCodeAt(state.position + 1) === 0x2D/* - */ &&
        state.input.charCodeAt(state.position + 2) === 0x2D/* - */) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);

    } else if (hasDirectives) {
      throwError(state, 'directives end mark is expected');
    }

    composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
    skipSeparationSpace(state, true, -1);

    if (state.checkLineBreaks &&
        PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
      throwWarning(state, 'non-ASCII line breaks are interpreted as content');
    }

    state.documents.push(state.result);

    if (state.position === state.lineStart && testDocumentSeparator(state)) {

      if (state.input.charCodeAt(state.position) === 0x2E/* . */) {
        state.position += 3;
        skipSeparationSpace(state, true, -1);
      }
      return;
    }

    if (state.position < (state.length - 1)) {
      throwError(state, 'end of the stream or a document separator is expected');
    } else {
      return;
    }
  }


  function loadDocuments(input, options) {
    input = String(input);
    options = options || {};

    if (input.length !== 0) {

      // Add tailing `\n` if not exists
      if (input.charCodeAt(input.length - 1) !== 0x0A/* LF */ &&
          input.charCodeAt(input.length - 1) !== 0x0D/* CR */) {
        input += '\n';
      }

      // Strip BOM
      if (input.charCodeAt(0) === 0xFEFF) {
        input = input.slice(1);
      }
    }

    var state = new State(input, options);

    // Use 0 as string terminator. That significantly simplifies bounds check.
    state.input += '\0';

    while (state.input.charCodeAt(state.position) === 0x20/* Space */) {
      state.lineIndent += 1;
      state.position += 1;
    }

    while (state.position < (state.length - 1)) {
      readDocument(state);
    }

    return state.documents;
  }


  function loadAll(input, iterator, options) {
    var documents = loadDocuments(input, options), index, length;

    if (typeof iterator !== 'function') {
      return documents;
    }

    for (index = 0, length = documents.length; index < length; index += 1) {
      iterator(documents[index]);
    }
  }


  function load(input, options) {
    var documents = loadDocuments(input, options);

    if (documents.length === 0) {
      /*eslint-disable no-undefined*/
      return undefined;
    } else if (documents.length === 1) {
      return documents[0];
    }
    throw new exception$1('expected a single document in the stream, but found more');
  }


  function safeLoadAll(input, output, options) {
    if (typeof output === 'function') {
      loadAll(input, output, common.extend({ schema: default_safe }, options));
    } else {
      return loadAll(input, common.extend({ schema: default_safe }, options));
    }
  }


  function safeLoad(input, options) {
    return load(input, common.extend({ schema: default_safe }, options));
  }


  var loadAll_1     = loadAll;
  var load_1        = load;
  var safeLoadAll_1 = safeLoadAll;
  var safeLoad_1    = safeLoad;

  var loader = {
  	loadAll: loadAll_1,
  	load: load_1,
  	safeLoadAll: safeLoadAll_1,
  	safeLoad: safeLoad_1
  };

  /*eslint-disable no-use-before-define*/






  var _toString$2       = Object.prototype.toString;
  var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;

  var CHAR_TAB                  = 0x09; /* Tab */
  var CHAR_LINE_FEED            = 0x0A; /* LF */
  var CHAR_SPACE                = 0x20; /* Space */
  var CHAR_EXCLAMATION          = 0x21; /* ! */
  var CHAR_DOUBLE_QUOTE         = 0x22; /* " */
  var CHAR_SHARP                = 0x23; /* # */
  var CHAR_PERCENT              = 0x25; /* % */
  var CHAR_AMPERSAND            = 0x26; /* & */
  var CHAR_SINGLE_QUOTE         = 0x27; /* ' */
  var CHAR_ASTERISK             = 0x2A; /* * */
  var CHAR_COMMA                = 0x2C; /* , */
  var CHAR_MINUS                = 0x2D; /* - */
  var CHAR_COLON                = 0x3A; /* : */
  var CHAR_GREATER_THAN         = 0x3E; /* > */
  var CHAR_QUESTION             = 0x3F; /* ? */
  var CHAR_COMMERCIAL_AT        = 0x40; /* @ */
  var CHAR_LEFT_SQUARE_BRACKET  = 0x5B; /* [ */
  var CHAR_RIGHT_SQUARE_BRACKET = 0x5D; /* ] */
  var CHAR_GRAVE_ACCENT         = 0x60; /* ` */
  var CHAR_LEFT_CURLY_BRACKET   = 0x7B; /* { */
  var CHAR_VERTICAL_LINE        = 0x7C; /* | */
  var CHAR_RIGHT_CURLY_BRACKET  = 0x7D; /* } */

  var ESCAPE_SEQUENCES = {};

  ESCAPE_SEQUENCES[0x00]   = '\\0';
  ESCAPE_SEQUENCES[0x07]   = '\\a';
  ESCAPE_SEQUENCES[0x08]   = '\\b';
  ESCAPE_SEQUENCES[0x09]   = '\\t';
  ESCAPE_SEQUENCES[0x0A]   = '\\n';
  ESCAPE_SEQUENCES[0x0B]   = '\\v';
  ESCAPE_SEQUENCES[0x0C]   = '\\f';
  ESCAPE_SEQUENCES[0x0D]   = '\\r';
  ESCAPE_SEQUENCES[0x1B]   = '\\e';
  ESCAPE_SEQUENCES[0x22]   = '\\"';
  ESCAPE_SEQUENCES[0x5C]   = '\\\\';
  ESCAPE_SEQUENCES[0x85]   = '\\N';
  ESCAPE_SEQUENCES[0xA0]   = '\\_';
  ESCAPE_SEQUENCES[0x2028] = '\\L';
  ESCAPE_SEQUENCES[0x2029] = '\\P';

  var DEPRECATED_BOOLEANS_SYNTAX = [
    'y', 'Y', 'yes', 'Yes', 'YES', 'on', 'On', 'ON',
    'n', 'N', 'no', 'No', 'NO', 'off', 'Off', 'OFF'
  ];

  function compileStyleMap(schema, map) {
    var result, keys, index, length, tag, style, type;

    if (map === null) { return {}; }

    result = {};
    keys = Object.keys(map);

    for (index = 0, length = keys.length; index < length; index += 1) {
      tag = keys[index];
      style = String(map[tag]);

      if (tag.slice(0, 2) === '!!') {
        tag = 'tag:yaml.org,2002:' + tag.slice(2);
      }
      type = schema.compiledTypeMap['fallback'][tag];

      if (type && _hasOwnProperty$3.call(type.styleAliases, style)) {
        style = type.styleAliases[style];
      }

      result[tag] = style;
    }

    return result;
  }

  function encodeHex(character) {
    var string, handle, length;

    string = character.toString(16).toUpperCase();

    if (character <= 0xFF) {
      handle = 'x';
      length = 2;
    } else if (character <= 0xFFFF) {
      handle = 'u';
      length = 4;
    } else if (character <= 0xFFFFFFFF) {
      handle = 'U';
      length = 8;
    } else {
      throw new exception$1('code point within a string may not be greater than 0xFFFFFFFF');
    }

    return '\\' + handle + common.repeat('0', length - string.length) + string;
  }

  function State$1(options) {
    this.schema        = options['schema'] || default_full;
    this.indent        = Math.max(1, (options['indent'] || 2));
    this.noArrayIndent = options['noArrayIndent'] || false;
    this.skipInvalid   = options['skipInvalid'] || false;
    this.flowLevel     = (common.isNothing(options['flowLevel']) ? -1 : options['flowLevel']);
    this.styleMap      = compileStyleMap(this.schema, options['styles'] || null);
    this.sortKeys      = options['sortKeys'] || false;
    this.lineWidth     = options['lineWidth'] || 80;
    this.noRefs        = options['noRefs'] || false;
    this.noCompatMode  = options['noCompatMode'] || false;
    this.condenseFlow  = options['condenseFlow'] || false;

    this.implicitTypes = this.schema.compiledImplicit;
    this.explicitTypes = this.schema.compiledExplicit;

    this.tag = null;
    this.result = '';

    this.duplicates = [];
    this.usedDuplicates = null;
  }

  // Indents every line in a string. Empty lines (\n only) are not indented.
  function indentString(string, spaces) {
    var ind = common.repeat(' ', spaces),
        position = 0,
        next = -1,
        result = '',
        line,
        length = string.length;

    while (position < length) {
      next = string.indexOf('\n', position);
      if (next === -1) {
        line = string.slice(position);
        position = length;
      } else {
        line = string.slice(position, next + 1);
        position = next + 1;
      }

      if (line.length && line !== '\n') { result += ind; }

      result += line;
    }

    return result;
  }

  function generateNextLine(state, level) {
    return '\n' + common.repeat(' ', state.indent * level);
  }

  function testImplicitResolving(state, str) {
    var index, length, type;

    for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
      type = state.implicitTypes[index];

      if (type.resolve(str)) {
        return true;
      }
    }

    return false;
  }

  // [33] s-white ::= s-space | s-tab
  function isWhitespace(c) {
    return c === CHAR_SPACE || c === CHAR_TAB;
  }

  // Returns true if the character can be printed without escaping.
  // From YAML 1.2: "any allowed characters known to be non-printable
  // should also be escaped. [However,] This isn’t mandatory"
  // Derived from nb-char - \t - #x85 - #xA0 - #x2028 - #x2029.
  function isPrintable(c) {
    return  (0x00020 <= c && c <= 0x00007E)
        || ((0x000A1 <= c && c <= 0x00D7FF) && c !== 0x2028 && c !== 0x2029)
        || ((0x0E000 <= c && c <= 0x00FFFD) && c !== 0xFEFF /* BOM */)
        ||  (0x10000 <= c && c <= 0x10FFFF);
  }

  // Simplified test for values allowed after the first character in plain style.
  function isPlainSafe(c) {
    // Uses a subset of nb-char - c-flow-indicator - ":" - "#"
    // where nb-char ::= c-printable - b-char - c-byte-order-mark.
    return isPrintable(c) && c !== 0xFEFF
      // - c-flow-indicator
      && c !== CHAR_COMMA
      && c !== CHAR_LEFT_SQUARE_BRACKET
      && c !== CHAR_RIGHT_SQUARE_BRACKET
      && c !== CHAR_LEFT_CURLY_BRACKET
      && c !== CHAR_RIGHT_CURLY_BRACKET
      // - ":" - "#"
      && c !== CHAR_COLON
      && c !== CHAR_SHARP;
  }

  // Simplified test for values allowed as the first character in plain style.
  function isPlainSafeFirst(c) {
    // Uses a subset of ns-char - c-indicator
    // where ns-char = nb-char - s-white.
    return isPrintable(c) && c !== 0xFEFF
      && !isWhitespace(c) // - s-white
      // - (c-indicator ::=
      // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
      && c !== CHAR_MINUS
      && c !== CHAR_QUESTION
      && c !== CHAR_COLON
      && c !== CHAR_COMMA
      && c !== CHAR_LEFT_SQUARE_BRACKET
      && c !== CHAR_RIGHT_SQUARE_BRACKET
      && c !== CHAR_LEFT_CURLY_BRACKET
      && c !== CHAR_RIGHT_CURLY_BRACKET
      // | “#” | “&” | “*” | “!” | “|” | “>” | “'” | “"”
      && c !== CHAR_SHARP
      && c !== CHAR_AMPERSAND
      && c !== CHAR_ASTERISK
      && c !== CHAR_EXCLAMATION
      && c !== CHAR_VERTICAL_LINE
      && c !== CHAR_GREATER_THAN
      && c !== CHAR_SINGLE_QUOTE
      && c !== CHAR_DOUBLE_QUOTE
      // | “%” | “@” | “`”)
      && c !== CHAR_PERCENT
      && c !== CHAR_COMMERCIAL_AT
      && c !== CHAR_GRAVE_ACCENT;
  }

  // Determines whether block indentation indicator is required.
  function needIndentIndicator(string) {
    var leadingSpaceRe = /^\n* /;
    return leadingSpaceRe.test(string);
  }

  var STYLE_PLAIN   = 1,
      STYLE_SINGLE  = 2,
      STYLE_LITERAL = 3,
      STYLE_FOLDED  = 4,
      STYLE_DOUBLE  = 5;

  // Determines which scalar styles are possible and returns the preferred style.
  // lineWidth = -1 => no limit.
  // Pre-conditions: str.length > 0.
  // Post-conditions:
  //    STYLE_PLAIN or STYLE_SINGLE => no \n are in the string.
  //    STYLE_LITERAL => no lines are suitable for folding (or lineWidth is -1).
  //    STYLE_FOLDED => a line > lineWidth and can be folded (and lineWidth != -1).
  function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType) {
    var i;
    var char;
    var hasLineBreak = false;
    var hasFoldableLine = false; // only checked if shouldTrackWidth
    var shouldTrackWidth = lineWidth !== -1;
    var previousLineBreak = -1; // count the first line correctly
    var plain = isPlainSafeFirst(string.charCodeAt(0))
            && !isWhitespace(string.charCodeAt(string.length - 1));

    if (singleLineOnly) {
      // Case: no block styles.
      // Check for disallowed characters to rule out plain and single.
      for (i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        if (!isPrintable(char)) {
          return STYLE_DOUBLE;
        }
        plain = plain && isPlainSafe(char);
      }
    } else {
      // Case: block styles permitted.
      for (i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        if (char === CHAR_LINE_FEED) {
          hasLineBreak = true;
          // Check if any line can be folded.
          if (shouldTrackWidth) {
            hasFoldableLine = hasFoldableLine ||
              // Foldable line = too long, and not more-indented.
              (i - previousLineBreak - 1 > lineWidth &&
               string[previousLineBreak + 1] !== ' ');
            previousLineBreak = i;
          }
        } else if (!isPrintable(char)) {
          return STYLE_DOUBLE;
        }
        plain = plain && isPlainSafe(char);
      }
      // in case the end is missing a \n
      hasFoldableLine = hasFoldableLine || (shouldTrackWidth &&
        (i - previousLineBreak - 1 > lineWidth &&
         string[previousLineBreak + 1] !== ' '));
    }
    // Although every style can represent \n without escaping, prefer block styles
    // for multiline, since they're more readable and they don't add empty lines.
    // Also prefer folding a super-long line.
    if (!hasLineBreak && !hasFoldableLine) {
      // Strings interpretable as another type have to be quoted;
      // e.g. the string 'true' vs. the boolean true.
      return plain && !testAmbiguousType(string)
        ? STYLE_PLAIN : STYLE_SINGLE;
    }
    // Edge case: block indentation indicator can only have one digit.
    if (indentPerLevel > 9 && needIndentIndicator(string)) {
      return STYLE_DOUBLE;
    }
    // At this point we know block styles are valid.
    // Prefer literal style unless we want to fold.
    return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }

  // Note: line breaking/folding is implemented for only the folded style.
  // NB. We drop the last trailing newline (if any) of a returned block scalar
  //  since the dumper adds its own newline. This always works:
  //    • No ending newline => unaffected; already using strip "-" chomping.
  //    • Ending newline    => removed then restored.
  //  Importantly, this keeps the "+" chomp indicator from gaining an extra line.
  function writeScalar(state, string, level, iskey) {
    state.dump = (function () {
      if (string.length === 0) {
        return "''";
      }
      if (!state.noCompatMode &&
          DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1) {
        return "'" + string + "'";
      }

      var indent = state.indent * Math.max(1, level); // no 0-indent scalars
      // As indentation gets deeper, let the width decrease monotonically
      // to the lower bound min(state.lineWidth, 40).
      // Note that this implies
      //  state.lineWidth ≤ 40 + state.indent: width is fixed at the lower bound.
      //  state.lineWidth > 40 + state.indent: width decreases until the lower bound.
      // This behaves better than a constant minimum width which disallows narrower options,
      // or an indent threshold which causes the width to suddenly increase.
      var lineWidth = state.lineWidth === -1
        ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);

      // Without knowing if keys are implicit/explicit, assume implicit for safety.
      var singleLineOnly = iskey
        // No block styles in flow mode.
        || (state.flowLevel > -1 && level >= state.flowLevel);
      function testAmbiguity(string) {
        return testImplicitResolving(state, string);
      }

      switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth, testAmbiguity)) {
        case STYLE_PLAIN:
          return string;
        case STYLE_SINGLE:
          return "'" + string.replace(/'/g, "''") + "'";
        case STYLE_LITERAL:
          return '|' + blockHeader(string, state.indent)
            + dropEndingNewline(indentString(string, indent));
        case STYLE_FOLDED:
          return '>' + blockHeader(string, state.indent)
            + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
        case STYLE_DOUBLE:
          return '"' + escapeString(string) + '"';
        default:
          throw new exception$1('impossible error: invalid scalar style');
      }
    }());
  }

  // Pre-conditions: string is valid for a block scalar, 1 <= indentPerLevel <= 9.
  function blockHeader(string, indentPerLevel) {
    var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : '';

    // note the special case: the string '\n' counts as a "trailing" empty line.
    var clip =          string[string.length - 1] === '\n';
    var keep = clip && (string[string.length - 2] === '\n' || string === '\n');
    var chomp = keep ? '+' : (clip ? '' : '-');

    return indentIndicator + chomp + '\n';
  }

  // (See the note for writeScalar.)
  function dropEndingNewline(string) {
    return string[string.length - 1] === '\n' ? string.slice(0, -1) : string;
  }

  // Note: a long line without a suitable break point will exceed the width limit.
  // Pre-conditions: every char in str isPrintable, str.length > 0, width > 0.
  function foldString(string, width) {
    // In folded style, $k$ consecutive newlines output as $k+1$ newlines—
    // unless they're before or after a more-indented line, or at the very
    // beginning or end, in which case $k$ maps to $k$.
    // Therefore, parse each chunk as newline(s) followed by a content line.
    var lineRe = /(\n+)([^\n]*)/g;

    // first line (possibly an empty line)
    var result = (function () {
      var nextLF = string.indexOf('\n');
      nextLF = nextLF !== -1 ? nextLF : string.length;
      lineRe.lastIndex = nextLF;
      return foldLine(string.slice(0, nextLF), width);
    }());
    // If we haven't reached the first content line yet, don't add an extra \n.
    var prevMoreIndented = string[0] === '\n' || string[0] === ' ';
    var moreIndented;

    // rest of the lines
    var match;
    while ((match = lineRe.exec(string))) {
      var prefix = match[1], line = match[2];
      moreIndented = (line[0] === ' ');
      result += prefix
        + (!prevMoreIndented && !moreIndented && line !== ''
          ? '\n' : '')
        + foldLine(line, width);
      prevMoreIndented = moreIndented;
    }

    return result;
  }

  // Greedy line breaking.
  // Picks the longest line under the limit each time,
  // otherwise settles for the shortest line over the limit.
  // NB. More-indented lines *cannot* be folded, as that would add an extra \n.
  function foldLine(line, width) {
    if (line === '' || line[0] === ' ') { return line; }

    // Since a more-indented line adds a \n, breaks can't be followed by a space.
    var breakRe = / [^ ]/g; // note: the match index will always be <= length-2.
    var match;
    // start is an inclusive index. end, curr, and next are exclusive.
    var start = 0, end, curr = 0, next = 0;
    var result = '';

    // Invariants: 0 <= start <= length-1.
    //   0 <= curr <= next <= max(0, length-2). curr - start <= width.
    // Inside the loop:
    //   A match implies length >= 2, so curr and next are <= length-2.
    while ((match = breakRe.exec(line))) {
      next = match.index;
      // maintain invariant: curr - start <= width
      if (next - start > width) {
        end = (curr > start) ? curr : next; // derive end <= length-2
        result += '\n' + line.slice(start, end);
        // skip the space that was output as \n
        start = end + 1;                    // derive start <= length-1
      }
      curr = next;
    }

    // By the invariants, start <= length-1, so there is something left over.
    // It is either the whole string or a part starting from non-whitespace.
    result += '\n';
    // Insert a break if the remainder is too long and there is a break available.
    if (line.length - start > width && curr > start) {
      result += line.slice(start, curr) + '\n' + line.slice(curr + 1);
    } else {
      result += line.slice(start);
    }

    return result.slice(1); // drop extra \n joiner
  }

  // Escapes a double-quoted string.
  function escapeString(string) {
    var result = '';
    var char, nextChar;
    var escapeSeq;

    for (var i = 0; i < string.length; i++) {
      char = string.charCodeAt(i);
      // Check for surrogate pairs (reference Unicode 3.0 section "3.7 Surrogates").
      if (char >= 0xD800 && char <= 0xDBFF/* high surrogate */) {
        nextChar = string.charCodeAt(i + 1);
        if (nextChar >= 0xDC00 && nextChar <= 0xDFFF/* low surrogate */) {
          // Combine the surrogate pair and store it escaped.
          result += encodeHex((char - 0xD800) * 0x400 + nextChar - 0xDC00 + 0x10000);
          // Advance index one extra since we already used that char here.
          i++; continue;
        }
      }
      escapeSeq = ESCAPE_SEQUENCES[char];
      result += !escapeSeq && isPrintable(char)
        ? string[i]
        : escapeSeq || encodeHex(char);
    }

    return result;
  }

  function writeFlowSequence(state, level, object) {
    var _result = '',
        _tag    = state.tag,
        index,
        length;

    for (index = 0, length = object.length; index < length; index += 1) {
      // Write only valid elements.
      if (writeNode(state, level, object[index], false, false)) {
        if (index !== 0) { _result += ',' + (!state.condenseFlow ? ' ' : ''); }
        _result += state.dump;
      }
    }

    state.tag = _tag;
    state.dump = '[' + _result + ']';
  }

  function writeBlockSequence(state, level, object, compact) {
    var _result = '',
        _tag    = state.tag,
        index,
        length;

    for (index = 0, length = object.length; index < length; index += 1) {
      // Write only valid elements.
      if (writeNode(state, level + 1, object[index], true, true)) {
        if (!compact || index !== 0) {
          _result += generateNextLine(state, level);
        }

        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          _result += '-';
        } else {
          _result += '- ';
        }

        _result += state.dump;
      }
    }

    state.tag = _tag;
    state.dump = _result || '[]'; // Empty sequence if no valid values.
  }

  function writeFlowMapping(state, level, object) {
    var _result       = '',
        _tag          = state.tag,
        objectKeyList = Object.keys(object),
        index,
        length,
        objectKey,
        objectValue,
        pairBuffer;

    for (index = 0, length = objectKeyList.length; index < length; index += 1) {
      pairBuffer = state.condenseFlow ? '"' : '';

      if (index !== 0) { pairBuffer += ', '; }

      objectKey = objectKeyList[index];
      objectValue = object[objectKey];

      if (!writeNode(state, level, objectKey, false, false)) {
        continue; // Skip this pair because of invalid key;
      }

      if (state.dump.length > 1024) { pairBuffer += '? '; }

      pairBuffer += state.dump + (state.condenseFlow ? '"' : '') + ':' + (state.condenseFlow ? '' : ' ');

      if (!writeNode(state, level, objectValue, false, false)) {
        continue; // Skip this pair because of invalid value.
      }

      pairBuffer += state.dump;

      // Both key and value are valid.
      _result += pairBuffer;
    }

    state.tag = _tag;
    state.dump = '{' + _result + '}';
  }

  function writeBlockMapping(state, level, object, compact) {
    var _result       = '',
        _tag          = state.tag,
        objectKeyList = Object.keys(object),
        index,
        length,
        objectKey,
        objectValue,
        explicitPair,
        pairBuffer;

    // Allow sorting keys so that the output file is deterministic
    if (state.sortKeys === true) {
      // Default sorting
      objectKeyList.sort();
    } else if (typeof state.sortKeys === 'function') {
      // Custom sort function
      objectKeyList.sort(state.sortKeys);
    } else if (state.sortKeys) {
      // Something is wrong
      throw new exception$1('sortKeys must be a boolean or a function');
    }

    for (index = 0, length = objectKeyList.length; index < length; index += 1) {
      pairBuffer = '';

      if (!compact || index !== 0) {
        pairBuffer += generateNextLine(state, level);
      }

      objectKey = objectKeyList[index];
      objectValue = object[objectKey];

      if (!writeNode(state, level + 1, objectKey, true, true, true)) {
        continue; // Skip this pair because of invalid key.
      }

      explicitPair = (state.tag !== null && state.tag !== '?') ||
                     (state.dump && state.dump.length > 1024);

      if (explicitPair) {
        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          pairBuffer += '?';
        } else {
          pairBuffer += '? ';
        }
      }

      pairBuffer += state.dump;

      if (explicitPair) {
        pairBuffer += generateNextLine(state, level);
      }

      if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
        continue; // Skip this pair because of invalid value.
      }

      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += ':';
      } else {
        pairBuffer += ': ';
      }

      pairBuffer += state.dump;

      // Both key and value are valid.
      _result += pairBuffer;
    }

    state.tag = _tag;
    state.dump = _result || '{}'; // Empty mapping if no valid pairs.
  }

  function detectType(state, object, explicit) {
    var _result, typeList, index, length, type, style;

    typeList = explicit ? state.explicitTypes : state.implicitTypes;

    for (index = 0, length = typeList.length; index < length; index += 1) {
      type = typeList[index];

      if ((type.instanceOf  || type.predicate) &&
          (!type.instanceOf || ((typeof object === 'object') && (object instanceof type.instanceOf))) &&
          (!type.predicate  || type.predicate(object))) {

        state.tag = explicit ? type.tag : '?';

        if (type.represent) {
          style = state.styleMap[type.tag] || type.defaultStyle;

          if (_toString$2.call(type.represent) === '[object Function]') {
            _result = type.represent(object, style);
          } else if (_hasOwnProperty$3.call(type.represent, style)) {
            _result = type.represent[style](object, style);
          } else {
            throw new exception$1('!<' + type.tag + '> tag resolver accepts not "' + style + '" style');
          }

          state.dump = _result;
        }

        return true;
      }
    }

    return false;
  }

  // Serializes `object` and writes it to global `result`.
  // Returns true on success, or false on invalid object.
  //
  function writeNode(state, level, object, block, compact, iskey) {
    state.tag = null;
    state.dump = object;

    if (!detectType(state, object, false)) {
      detectType(state, object, true);
    }

    var type = _toString$2.call(state.dump);

    if (block) {
      block = (state.flowLevel < 0 || state.flowLevel > level);
    }

    var objectOrArray = type === '[object Object]' || type === '[object Array]',
        duplicateIndex,
        duplicate;

    if (objectOrArray) {
      duplicateIndex = state.duplicates.indexOf(object);
      duplicate = duplicateIndex !== -1;
    }

    if ((state.tag !== null && state.tag !== '?') || duplicate || (state.indent !== 2 && level > 0)) {
      compact = false;
    }

    if (duplicate && state.usedDuplicates[duplicateIndex]) {
      state.dump = '*ref_' + duplicateIndex;
    } else {
      if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
        state.usedDuplicates[duplicateIndex] = true;
      }
      if (type === '[object Object]') {
        if (block && (Object.keys(state.dump).length !== 0)) {
          writeBlockMapping(state, level, state.dump, compact);
          if (duplicate) {
            state.dump = '&ref_' + duplicateIndex + state.dump;
          }
        } else {
          writeFlowMapping(state, level, state.dump);
          if (duplicate) {
            state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
          }
        }
      } else if (type === '[object Array]') {
        var arrayLevel = (state.noArrayIndent && (level > 0)) ? level - 1 : level;
        if (block && (state.dump.length !== 0)) {
          writeBlockSequence(state, arrayLevel, state.dump, compact);
          if (duplicate) {
            state.dump = '&ref_' + duplicateIndex + state.dump;
          }
        } else {
          writeFlowSequence(state, arrayLevel, state.dump);
          if (duplicate) {
            state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
          }
        }
      } else if (type === '[object String]') {
        if (state.tag !== '?') {
          writeScalar(state, state.dump, level, iskey);
        }
      } else {
        if (state.skipInvalid) { return false; }
        throw new exception$1('unacceptable kind of an object to dump ' + type);
      }

      if (state.tag !== null && state.tag !== '?') {
        state.dump = '!<' + state.tag + '> ' + state.dump;
      }
    }

    return true;
  }

  function getDuplicateReferences(object, state) {
    var objects = [],
        duplicatesIndexes = [],
        index,
        length;

    inspectNode(object, objects, duplicatesIndexes);

    for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
      state.duplicates.push(objects[duplicatesIndexes[index]]);
    }
    state.usedDuplicates = new Array(length);
  }

  function inspectNode(object, objects, duplicatesIndexes) {
    var objectKeyList,
        index,
        length;

    if (object !== null && typeof object === 'object') {
      index = objects.indexOf(object);
      if (index !== -1) {
        if (duplicatesIndexes.indexOf(index) === -1) {
          duplicatesIndexes.push(index);
        }
      } else {
        objects.push(object);

        if (Array.isArray(object)) {
          for (index = 0, length = object.length; index < length; index += 1) {
            inspectNode(object[index], objects, duplicatesIndexes);
          }
        } else {
          objectKeyList = Object.keys(object);

          for (index = 0, length = objectKeyList.length; index < length; index += 1) {
            inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
          }
        }
      }
    }
  }

  function dump(input, options) {
    options = options || {};

    var state = new State$1(options);

    if (!state.noRefs) { getDuplicateReferences(input, state); }

    if (writeNode(state, 0, input, true, true)) { return state.dump + '\n'; }

    return '';
  }

  function safeDump(input, options) {
    return dump(input, common.extend({ schema: default_safe }, options));
  }

  var dump_1     = dump;
  var safeDump_1 = safeDump;

  var dumper = {
  	dump: dump_1,
  	safeDump: safeDump_1
  };

  function deprecated(name) {
    return function () {
      throw new Error('Function ' + name + ' is deprecated and cannot be used.');
    };
  }


  var Type$1                = type;
  var Schema$1              = schema;
  var FAILSAFE_SCHEMA     = failsafe;
  var JSON_SCHEMA         = json;
  var CORE_SCHEMA         = core;
  var DEFAULT_SAFE_SCHEMA = default_safe;
  var DEFAULT_FULL_SCHEMA = default_full;
  var load$1                = loader.load;
  var loadAll$1             = loader.loadAll;
  var safeLoad$1            = loader.safeLoad;
  var safeLoadAll$1         = loader.safeLoadAll;
  var dump$1                = dumper.dump;
  var safeDump$1            = dumper.safeDump;
  var YAMLException$1       = exception$1;

  // Deprecated schema names from JS-YAML 2.0.x
  var MINIMAL_SCHEMA = failsafe;
  var SAFE_SCHEMA    = default_safe;
  var DEFAULT_SCHEMA = default_full;

  // Deprecated functions from JS-YAML 1.x.x
  var scan           = deprecated('scan');
  var parse          = deprecated('parse');
  var compose        = deprecated('compose');
  var addConstructor = deprecated('addConstructor');

  var jsYaml = {
  	Type: Type$1,
  	Schema: Schema$1,
  	FAILSAFE_SCHEMA: FAILSAFE_SCHEMA,
  	JSON_SCHEMA: JSON_SCHEMA,
  	CORE_SCHEMA: CORE_SCHEMA,
  	DEFAULT_SAFE_SCHEMA: DEFAULT_SAFE_SCHEMA,
  	DEFAULT_FULL_SCHEMA: DEFAULT_FULL_SCHEMA,
  	load: load$1,
  	loadAll: loadAll$1,
  	safeLoad: safeLoad$1,
  	safeLoadAll: safeLoadAll$1,
  	dump: dump$1,
  	safeDump: safeDump$1,
  	YAMLException: YAMLException$1,
  	MINIMAL_SCHEMA: MINIMAL_SCHEMA,
  	SAFE_SCHEMA: SAFE_SCHEMA,
  	DEFAULT_SCHEMA: DEFAULT_SCHEMA,
  	scan: scan,
  	parse: parse,
  	compose: compose,
  	addConstructor: addConstructor
  };

  var jsYaml$1 = jsYaml;

  var pinRegistryConfig = function (board) {
    return path(boardLocalStorage(board), 'data.txt');
  };

  var pinRegistryLoadEntries = function (board) {
    var lock = pinRegistryLock(board);
    return onExit(
      function () { return pinRegistryUnlock(lock); },
      function () {
        var entriesPath = pinRegistryConfig(board);

        if (!fileExists(entriesPath)) {
          return [];
        } else {
          var yamlText = readLines(entriesPath).join('\n');
          var loadedYaml = jsYaml$1.safeLoad(yamlText);
          return loadedYaml;
        }
      }
    );
  };

  var pinRegistrySaveEntries = function (entries, board) {
    var lock = pinRegistryLock(board);
    return onExit(
      function () { return pinRegistryUnlock(lock); },
      function () {
        var yamlText = jsYaml$1.safeDump(entries);
        writeLines(pinRegistryConfig(board), yamlText.split('\n'));
      }
    );
  };

  var pinStoragePath$1 = function (board, name) {
    var path$1 = path(boardLocalStorage(board), name);
    if (!dir$1.exists(path$1))
      { dir$1.create(path$1, { recursive: true }); }

    return path$1;
  };

  var pinRegistryUpdate = function (name, board, params) {
    if ( params === void 0 ) params = list();

    var lock = pinRegistryLock(board);
    return onExit(
      function () { return pinRegistryUnlock(lock); },
      function () {
        var entries = pinRegistryLoadEntries(board);
        name = pinRegistryQualifyName(name, entries);

        var path = pinStoragePath$1(board, name);

        if (entries === null) { entries = {}; }

        var names = entries.map(function (e) { return e['name']; });
        var index = 0;
        if (names.includes(name)) {
          index = names.findIndex(function (e) { return name == e; });
        } else {
          index = entries.length;
          entries[index] = {};
        }

        entries[index]['name'] = name;

        for (var param in params) {
          if (
            (Array.isArray(params[param]) && params[param].length == 0) ||
            typeof params[param] === 'undefined'
          ) {
            delete entries[index][param];
          } else {
            entries[index][param] = params[param];
          }
        }

        pinRegistrySaveEntries(entries, board);

        return path;
      }
    );
  };

  var pinRegistryFind = function (text, board) {
    lock = pinRegistryLock(board);
    return onExit(
      function () { return pinRegistryUnlock(lock); },
      function () {
        var entries = pinRegistryLoadEntries(board);

        var results = pinResultsFromRows(entries);

        if (typeof text === 'string') {
          results = results.filter(
            function (x) { return !new RegExp(text, 'gi').test(x['name']); }
          );
        }

        return results;
      }
    );
  };

  var pinRegistryRetrieve = function (name, board) {
    var lock = pinRegistryLock(board);
    return onExit(
      function () { return pinRegistryUnlock(lock); },
      function () {
        var entries = pinRegistryLoadEntries(board);
        name = pinRegistryQualifyName(name, entries);

        var names = entries.map(function (e) { return e['name']; });
        if (!names.includes(name)) {
          pinLog('Pin not found, pins available in registry: ', names.join(', '));
          stop("Pin '", name, "' not found in '", board['name'], "' board.");
        }

        return entries[names.findIndex(function (e) { return e == name; })];
      }
    );
  };

  var pinRegistryRetrievePath = function (name, board) {
    var entry = pinRegistryRetrieve(name, board);

    return entry['path'];
  };

  var pinRegistryRemove = function (name, board, unlink) {
    if ( unlink === void 0 ) unlink = TRUE;

    var entries = pinRegistryLoadEntries(board);
    name = pinRegistryQualifyName(name, entries);

    var remove = entries.filter(function (x) { return x['name'] == name; });
    if (remove.length > 0) { remove = remove[0]; }
    else { return; }

    entries = entries.filter(function (x) { return x['name'] != name; });

    var removePath = pinRegistryAbsolute(remove$path, board);
    if (unlink) { unlink(removePath, (recursive = TRUE)); }

    return pinRegistrySaveEntries(entries, component);
  };

  var pinRegistryQualifyName = function (name, entries) {
    var names = entries.map(function (e) { return e['name']; });

    var namePattern = '';
    if (/\//g.test(name)) { namePattern = paste0('^', name, '$'); }
    else { namePattern = '.*/' + name + '$'; }

    var nameCandidate = names.filter(function (e) { return new RegExp(namePattern, 'gi').test(e); }
    );

    if (nameCandidate.length == 1) {
      name = nameCandidate;
    }

    return name;
  };

  var pinRegistryLock = function (board) {
    var lockFile$1 = pinRegistryConfig(board) + '.lock';
    return lockFile(
      lockFile$1,
      getOption('pins.lock.timeout', Infinity)
    );
  };

  var pinRegistryUnlock = function (lock) {
    return unlockFile(lock);
  };

  var pinRegistryRelative$1 = function (path, basePath) {
    path = normalizePath(path, { winslash: '/', mustWork: false });
    basePath = normalizePath(basePath, {
      winslash: '/',
      mustWork: false,
    });

    if (path.startsWith(basePath)) {
      path = path.substr(basePath.length + 1, path.length);
    }

    var relative = path.replace('^/', '');

    return relative;
  };

  var pinRegistryAbsolute = function (path$1, board) {
    var basePath = absolutePath(boardLocalStorage(board));

    if (path$1.startsWith(basePath)) {
      return path$1;
    } else {
      return normalizePath(
        path(basePath, path$1),
        (mustWork = false)
      );
    }
  };

  var namesArr = function (l) {
    if (isNull(l)) { return []; }
    else { return Object.keys(l); }
  };

  var removeNulls = function (obj) {
    for (var prop in obj) {
      if (isNull(obj[prop])) {
        delete obj[prop];
      }
    }
  };

  var pinManifestGet$1 = function (path$1) {
    var manifest = {};

    var dataTxt = path(path$1, 'data.txt');
    if (fileExists(dataTxt)) {
      var yamlText = readLines(dataTxt).join('\n');
      manifest = jsYaml$1.safeLoad(yamlText);
    }

    if (isNull(manifest['type'])) { manifest['type'] = 'files'; }

    return manifest;
  };

  var pinManifestExists = function (path$1) {
    return fileExists(path(path$1, 'data.txt'));
  };

  var pinManifestCreate = function (path$1, metadata, files) {
    var entries = Object.assign(
      {
        path: files,
      },
      metadata
    );

    removeNulls(entries);

    var yamlText = jsYaml$1.safeDump(entries);
    writeLines(
      path(path$1, 'data.txt'),
      yamlText.split('\n')
    );

    return entries;
  };

  var pinManifestMerge = function (baseManifest, resourceManifest) {
    // path requires special merge
    if (
      !isNull(resourceManifest['path']) &&
      !isNull(baseManifest['path']) &&
      !/https?:\/\//g.test(baseManifest['path'])
    ) {
      baseManifest['path'] = path(
        baseManifest['path'],
        resourceManifest['path']
      );
    }

    baseManifest = Object.assign(baseManifest, resourceManifest);

    return baseManifest;
  };

  var boardInitializeLocal = function (board) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];
    if (!dir$1.exists(board['cache']))
      { dir$1.create(board['cache'], { recursive: true }); }

    return board;
  };

  var boardPinCreateLocal = function (board, path, name, metadata) {
    var args = [], len = arguments.length - 4;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 4 ];

    boardVersionsCreate(board, (name = name), (path = path));

    var finalPath = pinStoragePath$1(board, name);

    var toDelete = dir$1.list(finalPath, { fullNames: true });
    toDelete = toDelete.filter(function (e) { return /(\/|\\)_versions$/gi.test(e); });
    dir$1.remove(toDelete, { recursive: true });
    if (!dir$1.exists(finalPath)) { dir$1.create(finalPath); }

    copy(dir$1.list(path, { fullNames: true }), finalPath, {
      recursive: true,
    });

    // reduce index size
    metadata['columns'] = null;

    var basePath = boardLocalStorage(board);

    return pinRegistryUpdate(
      name,
      board,
      Object.assign(
        {
          path: pinRegistryRelative$1(finalPath, { basePath: basePath }),
        },
        metadata
      )
    );
  };

  var boardPinFindLocal = function (board, text) {
    var args = [], len = arguments.length - 2;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

    var results = pinRegistryFind(text, board);

    if (results.length == 1) {
      var metadata = JSON.parse(results['metadata']);
      var path = pinRegistryAbsolute(metadata['path'], board);
      var extended = pinManifestGet$1(path);
      var merged = pinManifestMerge(metadata, extended);

      results['metadata'] = JSON.stringify(merged);
    }

    return results;
  };

  var boardPinGetLocal = function (board, name) {
    var args = [], len = arguments.length - 2;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

    var version = args['version'];
    var path$1 = pinRegistryRetrievePath(name, board);

    if (!isNull(version)) {
      var manifest = pinManifestGet$1(pinRegistryAbsolute(path$1, board));

      if (!manifest['versions'].includes(version)) {
        version = boardVersionsExpand(manifest['versions'], version);
      }

      path$1 = path(name, version);
    }

    return pinRegistryAbsolute(path$1, board);
  };

  var boardPinRemoveLocal = function (board, name) {
    var args = [], len = arguments.length - 2;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

    return pinRegistryRemove(name, board);
  };

  var boardPinVersionsLocal = function (board, name) {
    var args = [], len = arguments.length - 2;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

    return boardVersionsGet(board, name);
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
      object && object.class
        ? object.class
        : object.constructor && object.constructor.name
        ? object.constructor.name
        : DEFAULT_CLASS_NAME;

    // support to construct objects by wrrapping object in content/class dictionary
    if (typeof object['_content'] !== 'undefined') {
      object = object['_content'];
    }

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

  /**
   * @param typeMap [Object] Map of MIME type -> Array[extensions]
   * @param ...
   */
  function Mime() {
    var arguments$1 = arguments;

    this._types = Object.create(null);
    this._extensions = Object.create(null);

    for (var i = 0; i < arguments.length; i++) {
      this.define(arguments$1[i]);
    }

    this.define = this.define.bind(this);
    this.getType = this.getType.bind(this);
    this.getExtension = this.getExtension.bind(this);
  }

  /**
   * Define mimetype -> extension mappings.  Each key is a mime-type that maps
   * to an array of extensions associated with the type.  The first extension is
   * used as the default extension for the type.
   *
   * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
   *
   * If a type declares an extension that has already been defined, an error will
   * be thrown.  To suppress this error and force the extension to be associated
   * with the new type, pass `force`=true.  Alternatively, you may prefix the
   * extension with "*" to map the type to extension, without mapping the
   * extension to the type.
   *
   * e.g. mime.define({'audio/wav', ['wav']}, {'audio/x-wav', ['*wav']});
   *
   *
   * @param map (Object) type definitions
   * @param force (Boolean) if true, force overriding of existing definitions
   */
  Mime.prototype.define = function(typeMap, force) {
    for (var type in typeMap) {
      var extensions = typeMap[type].map(function(t) {return t.toLowerCase()});
      type = type.toLowerCase();

      for (var i = 0; i < extensions.length; i++) {
        var ext = extensions[i];

        // '*' prefix = not the preferred type for this extension.  So fixup the
        // extension, and skip it.
        if (ext[0] == '*') {
          continue;
        }

        if (!force && (ext in this._types)) {
          throw new Error(
            'Attempt to change mapping for "' + ext +
            '" extension from "' + this._types[ext] + '" to "' + type +
            '". Pass `force=true` to allow this, otherwise remove "' + ext +
            '" from the list of extensions for "' + type + '".'
          );
        }

        this._types[ext] = type;
      }

      // Use first extension as default
      if (force || !this._extensions[type]) {
        var ext = extensions[0];
        this._extensions[type] = (ext[0] != '*') ? ext : ext.substr(1);
      }
    }
  };

  /**
   * Lookup a mime type based on extension
   */
  Mime.prototype.getType = function(path) {
    path = String(path);
    var last = path.replace(/^.*[/\\]/, '').toLowerCase();
    var ext = last.replace(/^.*\./, '').toLowerCase();

    var hasPath = last.length < path.length;
    var hasDot = ext.length < last.length - 1;

    return (hasDot || !hasPath) && this._types[ext] || null;
  };

  /**
   * Return file extension associated with a mime type
   */
  Mime.prototype.getExtension = function(type) {
    type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
    return type && this._extensions[type.toLowerCase()] || null;
  };

  var Mime_1 = Mime;

  var standard = {"application/andrew-inset":["ez"],"application/applixware":["aw"],"application/atom+xml":["atom"],"application/atomcat+xml":["atomcat"],"application/atomsvc+xml":["atomsvc"],"application/bdoc":["bdoc"],"application/ccxml+xml":["ccxml"],"application/cdmi-capability":["cdmia"],"application/cdmi-container":["cdmic"],"application/cdmi-domain":["cdmid"],"application/cdmi-object":["cdmio"],"application/cdmi-queue":["cdmiq"],"application/cu-seeme":["cu"],"application/dash+xml":["mpd"],"application/davmount+xml":["davmount"],"application/docbook+xml":["dbk"],"application/dssc+der":["dssc"],"application/dssc+xml":["xdssc"],"application/ecmascript":["ecma","es"],"application/emma+xml":["emma"],"application/epub+zip":["epub"],"application/exi":["exi"],"application/font-tdpfr":["pfr"],"application/geo+json":["geojson"],"application/gml+xml":["gml"],"application/gpx+xml":["gpx"],"application/gxf":["gxf"],"application/gzip":["gz"],"application/hjson":["hjson"],"application/hyperstudio":["stk"],"application/inkml+xml":["ink","inkml"],"application/ipfix":["ipfix"],"application/java-archive":["jar","war","ear"],"application/java-serialized-object":["ser"],"application/java-vm":["class"],"application/javascript":["js","mjs"],"application/json":["json","map"],"application/json5":["json5"],"application/jsonml+json":["jsonml"],"application/ld+json":["jsonld"],"application/lost+xml":["lostxml"],"application/mac-binhex40":["hqx"],"application/mac-compactpro":["cpt"],"application/mads+xml":["mads"],"application/manifest+json":["webmanifest"],"application/marc":["mrc"],"application/marcxml+xml":["mrcx"],"application/mathematica":["ma","nb","mb"],"application/mathml+xml":["mathml"],"application/mbox":["mbox"],"application/mediaservercontrol+xml":["mscml"],"application/metalink+xml":["metalink"],"application/metalink4+xml":["meta4"],"application/mets+xml":["mets"],"application/mods+xml":["mods"],"application/mp21":["m21","mp21"],"application/mp4":["mp4s","m4p"],"application/msword":["doc","dot"],"application/mxf":["mxf"],"application/n-quads":["nq"],"application/n-triples":["nt"],"application/octet-stream":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"],"application/oda":["oda"],"application/oebps-package+xml":["opf"],"application/ogg":["ogx"],"application/omdoc+xml":["omdoc"],"application/onenote":["onetoc","onetoc2","onetmp","onepkg"],"application/oxps":["oxps"],"application/patch-ops-error+xml":["xer"],"application/pdf":["pdf"],"application/pgp-encrypted":["pgp"],"application/pgp-signature":["asc","sig"],"application/pics-rules":["prf"],"application/pkcs10":["p10"],"application/pkcs7-mime":["p7m","p7c"],"application/pkcs7-signature":["p7s"],"application/pkcs8":["p8"],"application/pkix-attr-cert":["ac"],"application/pkix-cert":["cer"],"application/pkix-crl":["crl"],"application/pkix-pkipath":["pkipath"],"application/pkixcmp":["pki"],"application/pls+xml":["pls"],"application/postscript":["ai","eps","ps"],"application/pskc+xml":["pskcxml"],"application/raml+yaml":["raml"],"application/rdf+xml":["rdf","owl"],"application/reginfo+xml":["rif"],"application/relax-ng-compact-syntax":["rnc"],"application/resource-lists+xml":["rl"],"application/resource-lists-diff+xml":["rld"],"application/rls-services+xml":["rs"],"application/rpki-ghostbusters":["gbr"],"application/rpki-manifest":["mft"],"application/rpki-roa":["roa"],"application/rsd+xml":["rsd"],"application/rss+xml":["rss"],"application/rtf":["rtf"],"application/sbml+xml":["sbml"],"application/scvp-cv-request":["scq"],"application/scvp-cv-response":["scs"],"application/scvp-vp-request":["spq"],"application/scvp-vp-response":["spp"],"application/sdp":["sdp"],"application/set-payment-initiation":["setpay"],"application/set-registration-initiation":["setreg"],"application/shf+xml":["shf"],"application/sieve":["siv","sieve"],"application/smil+xml":["smi","smil"],"application/sparql-query":["rq"],"application/sparql-results+xml":["srx"],"application/srgs":["gram"],"application/srgs+xml":["grxml"],"application/sru+xml":["sru"],"application/ssdl+xml":["ssdl"],"application/ssml+xml":["ssml"],"application/tei+xml":["tei","teicorpus"],"application/thraud+xml":["tfi"],"application/timestamped-data":["tsd"],"application/voicexml+xml":["vxml"],"application/wasm":["wasm"],"application/widget":["wgt"],"application/winhlp":["hlp"],"application/wsdl+xml":["wsdl"],"application/wspolicy+xml":["wspolicy"],"application/xaml+xml":["xaml"],"application/xcap-diff+xml":["xdf"],"application/xenc+xml":["xenc"],"application/xhtml+xml":["xhtml","xht"],"application/xml":["xml","xsl","xsd","rng"],"application/xml-dtd":["dtd"],"application/xop+xml":["xop"],"application/xproc+xml":["xpl"],"application/xslt+xml":["xslt"],"application/xspf+xml":["xspf"],"application/xv+xml":["mxml","xhvml","xvml","xvm"],"application/yang":["yang"],"application/yin+xml":["yin"],"application/zip":["zip"],"audio/3gpp":["*3gpp"],"audio/adpcm":["adp"],"audio/basic":["au","snd"],"audio/midi":["mid","midi","kar","rmi"],"audio/mp3":["*mp3"],"audio/mp4":["m4a","mp4a"],"audio/mpeg":["mpga","mp2","mp2a","mp3","m2a","m3a"],"audio/ogg":["oga","ogg","spx"],"audio/s3m":["s3m"],"audio/silk":["sil"],"audio/wav":["wav"],"audio/wave":["*wav"],"audio/webm":["weba"],"audio/xm":["xm"],"font/collection":["ttc"],"font/otf":["otf"],"font/ttf":["ttf"],"font/woff":["woff"],"font/woff2":["woff2"],"image/aces":["exr"],"image/apng":["apng"],"image/bmp":["bmp"],"image/cgm":["cgm"],"image/dicom-rle":["drle"],"image/emf":["emf"],"image/fits":["fits"],"image/g3fax":["g3"],"image/gif":["gif"],"image/heic":["heic"],"image/heic-sequence":["heics"],"image/heif":["heif"],"image/heif-sequence":["heifs"],"image/ief":["ief"],"image/jls":["jls"],"image/jp2":["jp2","jpg2"],"image/jpeg":["jpeg","jpg","jpe"],"image/jpm":["jpm"],"image/jpx":["jpx","jpf"],"image/jxr":["jxr"],"image/ktx":["ktx"],"image/png":["png"],"image/sgi":["sgi"],"image/svg+xml":["svg","svgz"],"image/t38":["t38"],"image/tiff":["tif","tiff"],"image/tiff-fx":["tfx"],"image/webp":["webp"],"image/wmf":["wmf"],"message/disposition-notification":["disposition-notification"],"message/global":["u8msg"],"message/global-delivery-status":["u8dsn"],"message/global-disposition-notification":["u8mdn"],"message/global-headers":["u8hdr"],"message/rfc822":["eml","mime"],"model/3mf":["3mf"],"model/gltf+json":["gltf"],"model/gltf-binary":["glb"],"model/iges":["igs","iges"],"model/mesh":["msh","mesh","silo"],"model/stl":["stl"],"model/vrml":["wrl","vrml"],"model/x3d+binary":["*x3db","x3dbz"],"model/x3d+fastinfoset":["x3db"],"model/x3d+vrml":["*x3dv","x3dvz"],"model/x3d+xml":["x3d","x3dz"],"model/x3d-vrml":["x3dv"],"text/cache-manifest":["appcache","manifest"],"text/calendar":["ics","ifb"],"text/coffeescript":["coffee","litcoffee"],"text/css":["css"],"text/csv":["csv"],"text/html":["html","htm","shtml"],"text/jade":["jade"],"text/jsx":["jsx"],"text/less":["less"],"text/markdown":["markdown","md"],"text/mathml":["mml"],"text/mdx":["mdx"],"text/n3":["n3"],"text/plain":["txt","text","conf","def","list","log","in","ini"],"text/richtext":["rtx"],"text/rtf":["*rtf"],"text/sgml":["sgml","sgm"],"text/shex":["shex"],"text/slim":["slim","slm"],"text/stylus":["stylus","styl"],"text/tab-separated-values":["tsv"],"text/troff":["t","tr","roff","man","me","ms"],"text/turtle":["ttl"],"text/uri-list":["uri","uris","urls"],"text/vcard":["vcard"],"text/vtt":["vtt"],"text/xml":["*xml"],"text/yaml":["yaml","yml"],"video/3gpp":["3gp","3gpp"],"video/3gpp2":["3g2"],"video/h261":["h261"],"video/h263":["h263"],"video/h264":["h264"],"video/jpeg":["jpgv"],"video/jpm":["*jpm","jpgm"],"video/mj2":["mj2","mjp2"],"video/mp2t":["ts"],"video/mp4":["mp4","mp4v","mpg4"],"video/mpeg":["mpeg","mpg","mpe","m1v","m2v"],"video/ogg":["ogv"],"video/quicktime":["qt","mov"],"video/webm":["webm"]};

  var other = {"application/prs.cww":["cww"],"application/vnd.3gpp.pic-bw-large":["plb"],"application/vnd.3gpp.pic-bw-small":["psb"],"application/vnd.3gpp.pic-bw-var":["pvb"],"application/vnd.3gpp2.tcap":["tcap"],"application/vnd.3m.post-it-notes":["pwn"],"application/vnd.accpac.simply.aso":["aso"],"application/vnd.accpac.simply.imp":["imp"],"application/vnd.acucobol":["acu"],"application/vnd.acucorp":["atc","acutc"],"application/vnd.adobe.air-application-installer-package+zip":["air"],"application/vnd.adobe.formscentral.fcdt":["fcdt"],"application/vnd.adobe.fxp":["fxp","fxpl"],"application/vnd.adobe.xdp+xml":["xdp"],"application/vnd.adobe.xfdf":["xfdf"],"application/vnd.ahead.space":["ahead"],"application/vnd.airzip.filesecure.azf":["azf"],"application/vnd.airzip.filesecure.azs":["azs"],"application/vnd.amazon.ebook":["azw"],"application/vnd.americandynamics.acc":["acc"],"application/vnd.amiga.ami":["ami"],"application/vnd.android.package-archive":["apk"],"application/vnd.anser-web-certificate-issue-initiation":["cii"],"application/vnd.anser-web-funds-transfer-initiation":["fti"],"application/vnd.antix.game-component":["atx"],"application/vnd.apple.installer+xml":["mpkg"],"application/vnd.apple.keynote":["keynote"],"application/vnd.apple.mpegurl":["m3u8"],"application/vnd.apple.numbers":["numbers"],"application/vnd.apple.pages":["pages"],"application/vnd.apple.pkpass":["pkpass"],"application/vnd.aristanetworks.swi":["swi"],"application/vnd.astraea-software.iota":["iota"],"application/vnd.audiograph":["aep"],"application/vnd.blueice.multipass":["mpm"],"application/vnd.bmi":["bmi"],"application/vnd.businessobjects":["rep"],"application/vnd.chemdraw+xml":["cdxml"],"application/vnd.chipnuts.karaoke-mmd":["mmd"],"application/vnd.cinderella":["cdy"],"application/vnd.citationstyles.style+xml":["csl"],"application/vnd.claymore":["cla"],"application/vnd.cloanto.rp9":["rp9"],"application/vnd.clonk.c4group":["c4g","c4d","c4f","c4p","c4u"],"application/vnd.cluetrust.cartomobile-config":["c11amc"],"application/vnd.cluetrust.cartomobile-config-pkg":["c11amz"],"application/vnd.commonspace":["csp"],"application/vnd.contact.cmsg":["cdbcmsg"],"application/vnd.cosmocaller":["cmc"],"application/vnd.crick.clicker":["clkx"],"application/vnd.crick.clicker.keyboard":["clkk"],"application/vnd.crick.clicker.palette":["clkp"],"application/vnd.crick.clicker.template":["clkt"],"application/vnd.crick.clicker.wordbank":["clkw"],"application/vnd.criticaltools.wbs+xml":["wbs"],"application/vnd.ctc-posml":["pml"],"application/vnd.cups-ppd":["ppd"],"application/vnd.curl.car":["car"],"application/vnd.curl.pcurl":["pcurl"],"application/vnd.dart":["dart"],"application/vnd.data-vision.rdz":["rdz"],"application/vnd.dece.data":["uvf","uvvf","uvd","uvvd"],"application/vnd.dece.ttml+xml":["uvt","uvvt"],"application/vnd.dece.unspecified":["uvx","uvvx"],"application/vnd.dece.zip":["uvz","uvvz"],"application/vnd.denovo.fcselayout-link":["fe_launch"],"application/vnd.dna":["dna"],"application/vnd.dolby.mlp":["mlp"],"application/vnd.dpgraph":["dpg"],"application/vnd.dreamfactory":["dfac"],"application/vnd.ds-keypoint":["kpxx"],"application/vnd.dvb.ait":["ait"],"application/vnd.dvb.service":["svc"],"application/vnd.dynageo":["geo"],"application/vnd.ecowin.chart":["mag"],"application/vnd.enliven":["nml"],"application/vnd.epson.esf":["esf"],"application/vnd.epson.msf":["msf"],"application/vnd.epson.quickanime":["qam"],"application/vnd.epson.salt":["slt"],"application/vnd.epson.ssf":["ssf"],"application/vnd.eszigno3+xml":["es3","et3"],"application/vnd.ezpix-album":["ez2"],"application/vnd.ezpix-package":["ez3"],"application/vnd.fdf":["fdf"],"application/vnd.fdsn.mseed":["mseed"],"application/vnd.fdsn.seed":["seed","dataless"],"application/vnd.flographit":["gph"],"application/vnd.fluxtime.clip":["ftc"],"application/vnd.framemaker":["fm","frame","maker","book"],"application/vnd.frogans.fnc":["fnc"],"application/vnd.frogans.ltf":["ltf"],"application/vnd.fsc.weblaunch":["fsc"],"application/vnd.fujitsu.oasys":["oas"],"application/vnd.fujitsu.oasys2":["oa2"],"application/vnd.fujitsu.oasys3":["oa3"],"application/vnd.fujitsu.oasysgp":["fg5"],"application/vnd.fujitsu.oasysprs":["bh2"],"application/vnd.fujixerox.ddd":["ddd"],"application/vnd.fujixerox.docuworks":["xdw"],"application/vnd.fujixerox.docuworks.binder":["xbd"],"application/vnd.fuzzysheet":["fzs"],"application/vnd.genomatix.tuxedo":["txd"],"application/vnd.geogebra.file":["ggb"],"application/vnd.geogebra.tool":["ggt"],"application/vnd.geometry-explorer":["gex","gre"],"application/vnd.geonext":["gxt"],"application/vnd.geoplan":["g2w"],"application/vnd.geospace":["g3w"],"application/vnd.gmx":["gmx"],"application/vnd.google-apps.document":["gdoc"],"application/vnd.google-apps.presentation":["gslides"],"application/vnd.google-apps.spreadsheet":["gsheet"],"application/vnd.google-earth.kml+xml":["kml"],"application/vnd.google-earth.kmz":["kmz"],"application/vnd.grafeq":["gqf","gqs"],"application/vnd.groove-account":["gac"],"application/vnd.groove-help":["ghf"],"application/vnd.groove-identity-message":["gim"],"application/vnd.groove-injector":["grv"],"application/vnd.groove-tool-message":["gtm"],"application/vnd.groove-tool-template":["tpl"],"application/vnd.groove-vcard":["vcg"],"application/vnd.hal+xml":["hal"],"application/vnd.handheld-entertainment+xml":["zmm"],"application/vnd.hbci":["hbci"],"application/vnd.hhe.lesson-player":["les"],"application/vnd.hp-hpgl":["hpgl"],"application/vnd.hp-hpid":["hpid"],"application/vnd.hp-hps":["hps"],"application/vnd.hp-jlyt":["jlt"],"application/vnd.hp-pcl":["pcl"],"application/vnd.hp-pclxl":["pclxl"],"application/vnd.hydrostatix.sof-data":["sfd-hdstx"],"application/vnd.ibm.minipay":["mpy"],"application/vnd.ibm.modcap":["afp","listafp","list3820"],"application/vnd.ibm.rights-management":["irm"],"application/vnd.ibm.secure-container":["sc"],"application/vnd.iccprofile":["icc","icm"],"application/vnd.igloader":["igl"],"application/vnd.immervision-ivp":["ivp"],"application/vnd.immervision-ivu":["ivu"],"application/vnd.insors.igm":["igm"],"application/vnd.intercon.formnet":["xpw","xpx"],"application/vnd.intergeo":["i2g"],"application/vnd.intu.qbo":["qbo"],"application/vnd.intu.qfx":["qfx"],"application/vnd.ipunplugged.rcprofile":["rcprofile"],"application/vnd.irepository.package+xml":["irp"],"application/vnd.is-xpr":["xpr"],"application/vnd.isac.fcs":["fcs"],"application/vnd.jam":["jam"],"application/vnd.jcp.javame.midlet-rms":["rms"],"application/vnd.jisp":["jisp"],"application/vnd.joost.joda-archive":["joda"],"application/vnd.kahootz":["ktz","ktr"],"application/vnd.kde.karbon":["karbon"],"application/vnd.kde.kchart":["chrt"],"application/vnd.kde.kformula":["kfo"],"application/vnd.kde.kivio":["flw"],"application/vnd.kde.kontour":["kon"],"application/vnd.kde.kpresenter":["kpr","kpt"],"application/vnd.kde.kspread":["ksp"],"application/vnd.kde.kword":["kwd","kwt"],"application/vnd.kenameaapp":["htke"],"application/vnd.kidspiration":["kia"],"application/vnd.kinar":["kne","knp"],"application/vnd.koan":["skp","skd","skt","skm"],"application/vnd.kodak-descriptor":["sse"],"application/vnd.las.las+xml":["lasxml"],"application/vnd.llamagraphics.life-balance.desktop":["lbd"],"application/vnd.llamagraphics.life-balance.exchange+xml":["lbe"],"application/vnd.lotus-1-2-3":["123"],"application/vnd.lotus-approach":["apr"],"application/vnd.lotus-freelance":["pre"],"application/vnd.lotus-notes":["nsf"],"application/vnd.lotus-organizer":["org"],"application/vnd.lotus-screencam":["scm"],"application/vnd.lotus-wordpro":["lwp"],"application/vnd.macports.portpkg":["portpkg"],"application/vnd.mcd":["mcd"],"application/vnd.medcalcdata":["mc1"],"application/vnd.mediastation.cdkey":["cdkey"],"application/vnd.mfer":["mwf"],"application/vnd.mfmp":["mfm"],"application/vnd.micrografx.flo":["flo"],"application/vnd.micrografx.igx":["igx"],"application/vnd.mif":["mif"],"application/vnd.mobius.daf":["daf"],"application/vnd.mobius.dis":["dis"],"application/vnd.mobius.mbk":["mbk"],"application/vnd.mobius.mqy":["mqy"],"application/vnd.mobius.msl":["msl"],"application/vnd.mobius.plc":["plc"],"application/vnd.mobius.txf":["txf"],"application/vnd.mophun.application":["mpn"],"application/vnd.mophun.certificate":["mpc"],"application/vnd.mozilla.xul+xml":["xul"],"application/vnd.ms-artgalry":["cil"],"application/vnd.ms-cab-compressed":["cab"],"application/vnd.ms-excel":["xls","xlm","xla","xlc","xlt","xlw"],"application/vnd.ms-excel.addin.macroenabled.12":["xlam"],"application/vnd.ms-excel.sheet.binary.macroenabled.12":["xlsb"],"application/vnd.ms-excel.sheet.macroenabled.12":["xlsm"],"application/vnd.ms-excel.template.macroenabled.12":["xltm"],"application/vnd.ms-fontobject":["eot"],"application/vnd.ms-htmlhelp":["chm"],"application/vnd.ms-ims":["ims"],"application/vnd.ms-lrm":["lrm"],"application/vnd.ms-officetheme":["thmx"],"application/vnd.ms-outlook":["msg"],"application/vnd.ms-pki.seccat":["cat"],"application/vnd.ms-pki.stl":["*stl"],"application/vnd.ms-powerpoint":["ppt","pps","pot"],"application/vnd.ms-powerpoint.addin.macroenabled.12":["ppam"],"application/vnd.ms-powerpoint.presentation.macroenabled.12":["pptm"],"application/vnd.ms-powerpoint.slide.macroenabled.12":["sldm"],"application/vnd.ms-powerpoint.slideshow.macroenabled.12":["ppsm"],"application/vnd.ms-powerpoint.template.macroenabled.12":["potm"],"application/vnd.ms-project":["mpp","mpt"],"application/vnd.ms-word.document.macroenabled.12":["docm"],"application/vnd.ms-word.template.macroenabled.12":["dotm"],"application/vnd.ms-works":["wps","wks","wcm","wdb"],"application/vnd.ms-wpl":["wpl"],"application/vnd.ms-xpsdocument":["xps"],"application/vnd.mseq":["mseq"],"application/vnd.musician":["mus"],"application/vnd.muvee.style":["msty"],"application/vnd.mynfc":["taglet"],"application/vnd.neurolanguage.nlu":["nlu"],"application/vnd.nitf":["ntf","nitf"],"application/vnd.noblenet-directory":["nnd"],"application/vnd.noblenet-sealer":["nns"],"application/vnd.noblenet-web":["nnw"],"application/vnd.nokia.n-gage.data":["ngdat"],"application/vnd.nokia.n-gage.symbian.install":["n-gage"],"application/vnd.nokia.radio-preset":["rpst"],"application/vnd.nokia.radio-presets":["rpss"],"application/vnd.novadigm.edm":["edm"],"application/vnd.novadigm.edx":["edx"],"application/vnd.novadigm.ext":["ext"],"application/vnd.oasis.opendocument.chart":["odc"],"application/vnd.oasis.opendocument.chart-template":["otc"],"application/vnd.oasis.opendocument.database":["odb"],"application/vnd.oasis.opendocument.formula":["odf"],"application/vnd.oasis.opendocument.formula-template":["odft"],"application/vnd.oasis.opendocument.graphics":["odg"],"application/vnd.oasis.opendocument.graphics-template":["otg"],"application/vnd.oasis.opendocument.image":["odi"],"application/vnd.oasis.opendocument.image-template":["oti"],"application/vnd.oasis.opendocument.presentation":["odp"],"application/vnd.oasis.opendocument.presentation-template":["otp"],"application/vnd.oasis.opendocument.spreadsheet":["ods"],"application/vnd.oasis.opendocument.spreadsheet-template":["ots"],"application/vnd.oasis.opendocument.text":["odt"],"application/vnd.oasis.opendocument.text-master":["odm"],"application/vnd.oasis.opendocument.text-template":["ott"],"application/vnd.oasis.opendocument.text-web":["oth"],"application/vnd.olpc-sugar":["xo"],"application/vnd.oma.dd2+xml":["dd2"],"application/vnd.openofficeorg.extension":["oxt"],"application/vnd.openxmlformats-officedocument.presentationml.presentation":["pptx"],"application/vnd.openxmlformats-officedocument.presentationml.slide":["sldx"],"application/vnd.openxmlformats-officedocument.presentationml.slideshow":["ppsx"],"application/vnd.openxmlformats-officedocument.presentationml.template":["potx"],"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":["xlsx"],"application/vnd.openxmlformats-officedocument.spreadsheetml.template":["xltx"],"application/vnd.openxmlformats-officedocument.wordprocessingml.document":["docx"],"application/vnd.openxmlformats-officedocument.wordprocessingml.template":["dotx"],"application/vnd.osgeo.mapguide.package":["mgp"],"application/vnd.osgi.dp":["dp"],"application/vnd.osgi.subsystem":["esa"],"application/vnd.palm":["pdb","pqa","oprc"],"application/vnd.pawaafile":["paw"],"application/vnd.pg.format":["str"],"application/vnd.pg.osasli":["ei6"],"application/vnd.picsel":["efif"],"application/vnd.pmi.widget":["wg"],"application/vnd.pocketlearn":["plf"],"application/vnd.powerbuilder6":["pbd"],"application/vnd.previewsystems.box":["box"],"application/vnd.proteus.magazine":["mgz"],"application/vnd.publishare-delta-tree":["qps"],"application/vnd.pvi.ptid1":["ptid"],"application/vnd.quark.quarkxpress":["qxd","qxt","qwd","qwt","qxl","qxb"],"application/vnd.realvnc.bed":["bed"],"application/vnd.recordare.musicxml":["mxl"],"application/vnd.recordare.musicxml+xml":["musicxml"],"application/vnd.rig.cryptonote":["cryptonote"],"application/vnd.rim.cod":["cod"],"application/vnd.rn-realmedia":["rm"],"application/vnd.rn-realmedia-vbr":["rmvb"],"application/vnd.route66.link66+xml":["link66"],"application/vnd.sailingtracker.track":["st"],"application/vnd.seemail":["see"],"application/vnd.sema":["sema"],"application/vnd.semd":["semd"],"application/vnd.semf":["semf"],"application/vnd.shana.informed.formdata":["ifm"],"application/vnd.shana.informed.formtemplate":["itp"],"application/vnd.shana.informed.interchange":["iif"],"application/vnd.shana.informed.package":["ipk"],"application/vnd.simtech-mindmapper":["twd","twds"],"application/vnd.smaf":["mmf"],"application/vnd.smart.teacher":["teacher"],"application/vnd.solent.sdkm+xml":["sdkm","sdkd"],"application/vnd.spotfire.dxp":["dxp"],"application/vnd.spotfire.sfs":["sfs"],"application/vnd.stardivision.calc":["sdc"],"application/vnd.stardivision.draw":["sda"],"application/vnd.stardivision.impress":["sdd"],"application/vnd.stardivision.math":["smf"],"application/vnd.stardivision.writer":["sdw","vor"],"application/vnd.stardivision.writer-global":["sgl"],"application/vnd.stepmania.package":["smzip"],"application/vnd.stepmania.stepchart":["sm"],"application/vnd.sun.wadl+xml":["wadl"],"application/vnd.sun.xml.calc":["sxc"],"application/vnd.sun.xml.calc.template":["stc"],"application/vnd.sun.xml.draw":["sxd"],"application/vnd.sun.xml.draw.template":["std"],"application/vnd.sun.xml.impress":["sxi"],"application/vnd.sun.xml.impress.template":["sti"],"application/vnd.sun.xml.math":["sxm"],"application/vnd.sun.xml.writer":["sxw"],"application/vnd.sun.xml.writer.global":["sxg"],"application/vnd.sun.xml.writer.template":["stw"],"application/vnd.sus-calendar":["sus","susp"],"application/vnd.svd":["svd"],"application/vnd.symbian.install":["sis","sisx"],"application/vnd.syncml+xml":["xsm"],"application/vnd.syncml.dm+wbxml":["bdm"],"application/vnd.syncml.dm+xml":["xdm"],"application/vnd.tao.intent-module-archive":["tao"],"application/vnd.tcpdump.pcap":["pcap","cap","dmp"],"application/vnd.tmobile-livetv":["tmo"],"application/vnd.trid.tpt":["tpt"],"application/vnd.triscape.mxs":["mxs"],"application/vnd.trueapp":["tra"],"application/vnd.ufdl":["ufd","ufdl"],"application/vnd.uiq.theme":["utz"],"application/vnd.umajin":["umj"],"application/vnd.unity":["unityweb"],"application/vnd.uoml+xml":["uoml"],"application/vnd.vcx":["vcx"],"application/vnd.visio":["vsd","vst","vss","vsw"],"application/vnd.visionary":["vis"],"application/vnd.vsf":["vsf"],"application/vnd.wap.wbxml":["wbxml"],"application/vnd.wap.wmlc":["wmlc"],"application/vnd.wap.wmlscriptc":["wmlsc"],"application/vnd.webturbo":["wtb"],"application/vnd.wolfram.player":["nbp"],"application/vnd.wordperfect":["wpd"],"application/vnd.wqd":["wqd"],"application/vnd.wt.stf":["stf"],"application/vnd.xara":["xar"],"application/vnd.xfdl":["xfdl"],"application/vnd.yamaha.hv-dic":["hvd"],"application/vnd.yamaha.hv-script":["hvs"],"application/vnd.yamaha.hv-voice":["hvp"],"application/vnd.yamaha.openscoreformat":["osf"],"application/vnd.yamaha.openscoreformat.osfpvg+xml":["osfpvg"],"application/vnd.yamaha.smaf-audio":["saf"],"application/vnd.yamaha.smaf-phrase":["spf"],"application/vnd.yellowriver-custom-menu":["cmp"],"application/vnd.zul":["zir","zirz"],"application/vnd.zzazz.deck+xml":["zaz"],"application/x-7z-compressed":["7z"],"application/x-abiword":["abw"],"application/x-ace-compressed":["ace"],"application/x-apple-diskimage":["*dmg"],"application/x-arj":["arj"],"application/x-authorware-bin":["aab","x32","u32","vox"],"application/x-authorware-map":["aam"],"application/x-authorware-seg":["aas"],"application/x-bcpio":["bcpio"],"application/x-bdoc":["*bdoc"],"application/x-bittorrent":["torrent"],"application/x-blorb":["blb","blorb"],"application/x-bzip":["bz"],"application/x-bzip2":["bz2","boz"],"application/x-cbr":["cbr","cba","cbt","cbz","cb7"],"application/x-cdlink":["vcd"],"application/x-cfs-compressed":["cfs"],"application/x-chat":["chat"],"application/x-chess-pgn":["pgn"],"application/x-chrome-extension":["crx"],"application/x-cocoa":["cco"],"application/x-conference":["nsc"],"application/x-cpio":["cpio"],"application/x-csh":["csh"],"application/x-debian-package":["*deb","udeb"],"application/x-dgc-compressed":["dgc"],"application/x-director":["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"],"application/x-doom":["wad"],"application/x-dtbncx+xml":["ncx"],"application/x-dtbook+xml":["dtb"],"application/x-dtbresource+xml":["res"],"application/x-dvi":["dvi"],"application/x-envoy":["evy"],"application/x-eva":["eva"],"application/x-font-bdf":["bdf"],"application/x-font-ghostscript":["gsf"],"application/x-font-linux-psf":["psf"],"application/x-font-pcf":["pcf"],"application/x-font-snf":["snf"],"application/x-font-type1":["pfa","pfb","pfm","afm"],"application/x-freearc":["arc"],"application/x-futuresplash":["spl"],"application/x-gca-compressed":["gca"],"application/x-glulx":["ulx"],"application/x-gnumeric":["gnumeric"],"application/x-gramps-xml":["gramps"],"application/x-gtar":["gtar"],"application/x-hdf":["hdf"],"application/x-httpd-php":["php"],"application/x-install-instructions":["install"],"application/x-iso9660-image":["*iso"],"application/x-java-archive-diff":["jardiff"],"application/x-java-jnlp-file":["jnlp"],"application/x-latex":["latex"],"application/x-lua-bytecode":["luac"],"application/x-lzh-compressed":["lzh","lha"],"application/x-makeself":["run"],"application/x-mie":["mie"],"application/x-mobipocket-ebook":["prc","mobi"],"application/x-ms-application":["application"],"application/x-ms-shortcut":["lnk"],"application/x-ms-wmd":["wmd"],"application/x-ms-wmz":["wmz"],"application/x-ms-xbap":["xbap"],"application/x-msaccess":["mdb"],"application/x-msbinder":["obd"],"application/x-mscardfile":["crd"],"application/x-msclip":["clp"],"application/x-msdos-program":["*exe"],"application/x-msdownload":["*exe","*dll","com","bat","*msi"],"application/x-msmediaview":["mvb","m13","m14"],"application/x-msmetafile":["*wmf","*wmz","*emf","emz"],"application/x-msmoney":["mny"],"application/x-mspublisher":["pub"],"application/x-msschedule":["scd"],"application/x-msterminal":["trm"],"application/x-mswrite":["wri"],"application/x-netcdf":["nc","cdf"],"application/x-ns-proxy-autoconfig":["pac"],"application/x-nzb":["nzb"],"application/x-perl":["pl","pm"],"application/x-pilot":["*prc","*pdb"],"application/x-pkcs12":["p12","pfx"],"application/x-pkcs7-certificates":["p7b","spc"],"application/x-pkcs7-certreqresp":["p7r"],"application/x-rar-compressed":["rar"],"application/x-redhat-package-manager":["rpm"],"application/x-research-info-systems":["ris"],"application/x-sea":["sea"],"application/x-sh":["sh"],"application/x-shar":["shar"],"application/x-shockwave-flash":["swf"],"application/x-silverlight-app":["xap"],"application/x-sql":["sql"],"application/x-stuffit":["sit"],"application/x-stuffitx":["sitx"],"application/x-subrip":["srt"],"application/x-sv4cpio":["sv4cpio"],"application/x-sv4crc":["sv4crc"],"application/x-t3vm-image":["t3"],"application/x-tads":["gam"],"application/x-tar":["tar"],"application/x-tcl":["tcl","tk"],"application/x-tex":["tex"],"application/x-tex-tfm":["tfm"],"application/x-texinfo":["texinfo","texi"],"application/x-tgif":["obj"],"application/x-ustar":["ustar"],"application/x-virtualbox-hdd":["hdd"],"application/x-virtualbox-ova":["ova"],"application/x-virtualbox-ovf":["ovf"],"application/x-virtualbox-vbox":["vbox"],"application/x-virtualbox-vbox-extpack":["vbox-extpack"],"application/x-virtualbox-vdi":["vdi"],"application/x-virtualbox-vhd":["vhd"],"application/x-virtualbox-vmdk":["vmdk"],"application/x-wais-source":["src"],"application/x-web-app-manifest+json":["webapp"],"application/x-x509-ca-cert":["der","crt","pem"],"application/x-xfig":["fig"],"application/x-xliff+xml":["xlf"],"application/x-xpinstall":["xpi"],"application/x-xz":["xz"],"application/x-zmachine":["z1","z2","z3","z4","z5","z6","z7","z8"],"audio/vnd.dece.audio":["uva","uvva"],"audio/vnd.digital-winds":["eol"],"audio/vnd.dra":["dra"],"audio/vnd.dts":["dts"],"audio/vnd.dts.hd":["dtshd"],"audio/vnd.lucent.voice":["lvp"],"audio/vnd.ms-playready.media.pya":["pya"],"audio/vnd.nuera.ecelp4800":["ecelp4800"],"audio/vnd.nuera.ecelp7470":["ecelp7470"],"audio/vnd.nuera.ecelp9600":["ecelp9600"],"audio/vnd.rip":["rip"],"audio/x-aac":["aac"],"audio/x-aiff":["aif","aiff","aifc"],"audio/x-caf":["caf"],"audio/x-flac":["flac"],"audio/x-m4a":["*m4a"],"audio/x-matroska":["mka"],"audio/x-mpegurl":["m3u"],"audio/x-ms-wax":["wax"],"audio/x-ms-wma":["wma"],"audio/x-pn-realaudio":["ram","ra"],"audio/x-pn-realaudio-plugin":["rmp"],"audio/x-realaudio":["*ra"],"audio/x-wav":["*wav"],"chemical/x-cdx":["cdx"],"chemical/x-cif":["cif"],"chemical/x-cmdf":["cmdf"],"chemical/x-cml":["cml"],"chemical/x-csml":["csml"],"chemical/x-xyz":["xyz"],"image/prs.btif":["btif"],"image/prs.pti":["pti"],"image/vnd.adobe.photoshop":["psd"],"image/vnd.airzip.accelerator.azv":["azv"],"image/vnd.dece.graphic":["uvi","uvvi","uvg","uvvg"],"image/vnd.djvu":["djvu","djv"],"image/vnd.dvb.subtitle":["*sub"],"image/vnd.dwg":["dwg"],"image/vnd.dxf":["dxf"],"image/vnd.fastbidsheet":["fbs"],"image/vnd.fpx":["fpx"],"image/vnd.fst":["fst"],"image/vnd.fujixerox.edmics-mmr":["mmr"],"image/vnd.fujixerox.edmics-rlc":["rlc"],"image/vnd.microsoft.icon":["ico"],"image/vnd.ms-modi":["mdi"],"image/vnd.ms-photo":["wdp"],"image/vnd.net-fpx":["npx"],"image/vnd.tencent.tap":["tap"],"image/vnd.valve.source.texture":["vtf"],"image/vnd.wap.wbmp":["wbmp"],"image/vnd.xiff":["xif"],"image/vnd.zbrush.pcx":["pcx"],"image/x-3ds":["3ds"],"image/x-cmu-raster":["ras"],"image/x-cmx":["cmx"],"image/x-freehand":["fh","fhc","fh4","fh5","fh7"],"image/x-icon":["*ico"],"image/x-jng":["jng"],"image/x-mrsid-image":["sid"],"image/x-ms-bmp":["*bmp"],"image/x-pcx":["*pcx"],"image/x-pict":["pic","pct"],"image/x-portable-anymap":["pnm"],"image/x-portable-bitmap":["pbm"],"image/x-portable-graymap":["pgm"],"image/x-portable-pixmap":["ppm"],"image/x-rgb":["rgb"],"image/x-tga":["tga"],"image/x-xbitmap":["xbm"],"image/x-xpixmap":["xpm"],"image/x-xwindowdump":["xwd"],"message/vnd.wfa.wsc":["wsc"],"model/vnd.collada+xml":["dae"],"model/vnd.dwf":["dwf"],"model/vnd.gdl":["gdl"],"model/vnd.gtw":["gtw"],"model/vnd.mts":["mts"],"model/vnd.opengex":["ogex"],"model/vnd.parasolid.transmit.binary":["x_b"],"model/vnd.parasolid.transmit.text":["x_t"],"model/vnd.usdz+zip":["usdz"],"model/vnd.valve.source.compiled-map":["bsp"],"model/vnd.vtu":["vtu"],"text/prs.lines.tag":["dsc"],"text/vnd.curl":["curl"],"text/vnd.curl.dcurl":["dcurl"],"text/vnd.curl.mcurl":["mcurl"],"text/vnd.curl.scurl":["scurl"],"text/vnd.dvb.subtitle":["sub"],"text/vnd.fly":["fly"],"text/vnd.fmi.flexstor":["flx"],"text/vnd.graphviz":["gv"],"text/vnd.in3d.3dml":["3dml"],"text/vnd.in3d.spot":["spot"],"text/vnd.sun.j2me.app-descriptor":["jad"],"text/vnd.wap.wml":["wml"],"text/vnd.wap.wmlscript":["wmls"],"text/x-asm":["s","asm"],"text/x-c":["c","cc","cxx","cpp","h","hh","dic"],"text/x-component":["htc"],"text/x-fortran":["f","for","f77","f90"],"text/x-handlebars-template":["hbs"],"text/x-java-source":["java"],"text/x-lua":["lua"],"text/x-markdown":["mkd"],"text/x-nfo":["nfo"],"text/x-opml":["opml"],"text/x-org":["*org"],"text/x-pascal":["p","pas"],"text/x-processing":["pde"],"text/x-sass":["sass"],"text/x-scss":["scss"],"text/x-setext":["etx"],"text/x-sfv":["sfv"],"text/x-suse-ymp":["ymp"],"text/x-uuencode":["uu"],"text/x-vcalendar":["vcs"],"text/x-vcard":["vcf"],"video/vnd.dece.hd":["uvh","uvvh"],"video/vnd.dece.mobile":["uvm","uvvm"],"video/vnd.dece.pd":["uvp","uvvp"],"video/vnd.dece.sd":["uvs","uvvs"],"video/vnd.dece.video":["uvv","uvvv"],"video/vnd.dvb.file":["dvb"],"video/vnd.fvt":["fvt"],"video/vnd.mpegurl":["mxu","m4u"],"video/vnd.ms-playready.media.pyv":["pyv"],"video/vnd.uvvu.mp4":["uvu","uvvu"],"video/vnd.vivo":["viv"],"video/x-f4v":["f4v"],"video/x-fli":["fli"],"video/x-flv":["flv"],"video/x-m4v":["m4v"],"video/x-matroska":["mkv","mk3d","mks"],"video/x-mng":["mng"],"video/x-ms-asf":["asf","asx"],"video/x-ms-vob":["vob"],"video/x-ms-wm":["wm"],"video/x-ms-wmv":["wmv"],"video/x-ms-wmx":["wmx"],"video/x-ms-wvx":["wvx"],"video/x-msvideo":["avi"],"video/x-sgi-movie":["movie"],"video/x-smv":["smv"],"x-conference/x-cooltalk":["ice"]};

  var mime = new Mime_1(standard, other);

  // TODO nrow()
  // TODO filter((e, idx) => ())
  // TODO cbind()
  // TODO remove(column)
  // TODO order((e) => ())
  // TODO colnames()

  var DataFrame = function DataFrame(data, columns) {
    this.data = data;
    this.columns = columns;
  };

  var boardPinCreate = function (board, path, name, metadata) {
    var args = [], len = arguments.length - 4;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 4 ];

    return useMethod.apply(void 0, [ 'boardPinCreate', board, path, name, metadata ].concat( args ));
  };

  var boardInitialize = function (board) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    return useMethod.apply(void 0, [ 'boardInitialize', board ].concat( args ));
  };

  var boardInitializeDefault = function (board) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    stop("Board '", board$name, "' is not a valid board.");
  };

  var boardPinGet = function (board, name) {
    var args = [], len = arguments.length - 2;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

    return useMethod.apply(void 0, [ 'boardPinGet', board, name ].concat( args ));
  };

  // boardBrowse.default = function(board) { invisible(NULL) }

  var boardBrowseDefault = function (board) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    return null;
  };

  var boardEmptyResults = function () {
  };

  var boardPinVersionsDefault = function (board, name) {
    var args = [], len = arguments.length - 2;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];
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
    if (/^http:\/\/|^https:\/\//g.test(x)) {
      inferred['url'] = x;
      inferred['board'] = 'datatxt';

      // use only subdomain as friendly name which is also used as cache folder
      if (name == null || x === name) {
        inferred['name'] = inferred['url']
          .replace(/https?:\/\//g, '')
          .replace(/\\\\..*/g, '');
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
    var boards = concat(list$1(), defaults);

    return unique(boards);
  };

  var boardGet = function (name) {
    if (isNull(name)) {
      name = boardDefault();
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
        pinLog("Failed to register board " + name + ": " + err.toString());
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

  var pinSplitOwner = function (fullName) {
    if ( fullName === void 0 ) fullName = '';

    var parts = fullName.split('/');
    var name = parts.pop() || null;
    var owner = parts.join('/');

    return { name: name, owner: owner };
  };

  var pinContentName = function (fullName) {
    return typeof fullName === 'string' ? pinSplitOwner(fullName).name : fullName;
  };

  var pinResetCache = function (board, name) {
    // clean up name in case it's a full url
    var sanitizedName = name.replace(/^https?:\/\//g, '');
    var index = pinRegistryRetrieve(sanitizedName, board) || null;

    if (index) {
      index.cache = {};
      pinRegistryUpdate(sanitizedName, board, { params: index });
    }
  };

  function objectWithoutProperties$1 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }

  var pin = function (x) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    return useMethod.apply(void 0, [ 'pin', x ].concat( args ));
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
    var args = rest;

    if (isNull(board)) {
      var boardPinGetOrNull = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        try {
          return boardPinGet.apply(void 0, args);
        } catch (err) {
          return null;
        }
      };

      var result = boardPinGetOrNull(boardGet(null), name, { version: version });

      if (isNull(result) && isNull(board)) {
        for (var boardName in boardList()) {
          if (!cache) { pinResetCache(boardName, name); }
          result = boardPinGetOrNull(boardGet(boardName), name, {
            extract: extract,
            version: version,
          });
          if (!isNull(result)) {
            pinLog('Found pin ' + name + ' in board ' + boardName);
            break;
          }
        }
      }
      if (isNull(result))
        { throw new Exception("Failed to retrieve '" + name + "' pin."); }
    } else {
      if (!cache) { pinResetCache(board, name); }
      result = boardPinGet(
        boardGet(board),
        name,
        Object.assign.apply(Object, [ { extract: extract, version: version } ].concat( args ))
      );
    }

    var manifest = pinManifestGet$1(result);
    if (isNull(manifest['type'])) { manifest['type'] = 'files'; }

    var resultFiles = ensure(result)
      .filter(function (e) { return !new RegExp('^' + pinVersionsPathName()).test(e); });
    resultFiles = dir$1.list(resultFiles, { fullNames: true });
    if (manifest['type'] == 'files' && resultFiles.length > 1)
      { resultFiles = resultFiles.filter(function (e) { return /\/data\.txt$/g.test(e); }); }

    if (!isNull(signature)) {
      var pinSignature = pinVersionSignature(resultFiles);
      if (signature !== pin_signature)
        { throw new Exception(
          "Pin signature '" + pin_signature + "' does not match given signature."
        ); }
    }

    if (files) {
      return resultFiles;
    } else {
      return pinLoad({ _content: result, class: manifest['type'] });
    }
  };

  var pinRemove = function (name, board) {
    board = boardGet(board);

    boardPinRemove(board, name);
    uiViewerUpdated(board);

    return null;
  };

  var pinFindEmpty = function () {
    return new DataFrame(null, {
      name: 'character',
      description: 'character',
      type: 'character',
      metadata: 'character',
      board: 'character',
    });
  };

  var pinFind = function (ref) {
    var text = ref.text;
    var board = ref.board;
    var name = ref.name;
    var extended = ref.extended;
    var metadata = ref.metadata;
    var rest = objectWithoutProperties$1( ref, ["text", "board", "name", "extended", "metadata"] );
    var args = rest;

    if (isNull(board) || board.length == 0) { board = boardList(); }

    text = pinContentName(text);
    if (isNull(text) && !isNull(name)) { text = name; }

    var allPins = pinFindEmpty();

    board = ensure(board);
    for (var boardIdx in board) {
      var boardName = board[boardIdx];
      var boardObject = boardGet(boardName);

      var boardPins = null;
      try {
        boardPins = boardPinFind(
          Object.assign.apply(
            Object, [ { board: boardObject, text: text, name: name, extended: extended } ].concat( args )
          )
        );
      } catch (error) {
        pinLog("Error searching '" + boardName + "' board: " + error);
        boardPins = boardEmptyResults();
      }

      if (extended === true) {
        var extDF = null;
        try {
          JSON.parse('[' + boardPins['metadata'].join(',') + ']');
        } catch (error$1) {
          pinLog(
            'Failed to parse JSON metadata: ' + toString(boardPins['metadata'])
          );
        }

        if (isDataFrame(extDF) && boardpins.nrow() == extDF.nrow()) {
          extDF = []; // TODO ext_df[, !names(ext_df) %in% colnames(board_pins)]
          boardPins = boardPins.cbind(extDF);
        }
      }

      if (boardPins.nrow() > 0) {
        boardPins['board'] = Array(boardpins.nrow())
          .fill()
          .map(function (e) { return boardName; });

        allPins = pinResultsMerge(allPins, boardPins, extended === true);
      }
    }

    if (!isNull(text)) {
      allPins = allPins.filter(
        function (e) { return e['name'] == text ||
          (isNull(e['description'])
            ? false
            : new RegExp(text, 'i').test(e['description'])); }
      );
    }

    if (!metadata) {
      allPins.remove('metadata');
    }

    if (!isNull(name)) {
      allPins = allPins.filter(function (e) { return new RegExp('(.*/)?' + name + '$').test(e['name']); }
      );
      if (allPins.nrow() > 0) { allPins = allPins.filter(function (e, idx) { return idx === 0; }); }
    }

    // sort pin results by name
    allPins = allPins.order(function (e) { return e['name']; });

    return allPins;
  };

  var pinPreview = function (x) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    return useMethod.apply(void 0, [ 'pinPreview', x ].concat( args ));
  };

  var pinLoad = function (path) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    return useMethod.apply(void 0, [ 'pinLoad', path ].concat( args ));
  };

  var pinGetOne = function (name, board, extended, metadata) {
    // first ensure there is always one pin since metadata with multiple entries can fail
    var entry = pinFind({
      name: name,
      board: board,
      metadata: false,
      extended: false,
    });

    if (entry.nrow() == 0)
      { throw new Exception("Pin '" + name + "' was not found."); }
    if (entry.nrow() > 1)
      { throw new Exception(
        "Pin '" +
          name +
          "' was found in multiple boards: " +
          entry['board'].join(',') +
          '.'
      ); }

    board = entry['board'];
    entry = pinFind({
      name: name,
      board: board,
      metadata: metadata,
      extended: extended,
    });

    return entry;
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

    var entry = pinGetOne(name, board, extended, metadata);

    var board = entry['board'];

    metadata = [];
    if (entry.colnames().includes('metadata') && entry[metadata].length > 0) {
      metadata = JSON.parse(entry['metadata']);
    }

    if (signature) {
      var files = pinGet(name, { board: board, files: true });
      entry['signature'] = pinVersionSignature(files);
    }

    entryExt = entry.toList();
    delete entryExt['metadata'];

    entryExt = []; // TODO Filter(function(e) !is.list(e) || length(e) != 1 || !is.list(e[[1]]) || length(e[[1]]) > 0, entry_ext)

    for (name in metadata) {
      entryExt[name] = metadata[name];
    }

    return Object.assign(entry_ext, { class: 'pin_info' });
  };

  var pinFetch = function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    return useMethod.apply(void 0, [ 'pinFetch' ].concat( args ));
  };

  var pinVersions = function (name, ref) {
    var board = ref.board;
    var full = ref.full; if ( full === void 0 ) full = false;
    var rest = objectWithoutProperties$1( ref, ["board", "full"] );

    var versions = boardPinVersions(boardGet(board), name);

    if (!full) {
      versions['version'] = boardVersionsShorten(versions['version']);
    }

    return versions;
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
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .replace(/^-*|-*$/g, '')
      .replace(/-+/g, '-');

    if (!sanitized) {
      throw error;
    }

    if (board === BoardName.kaggle && sanitized.length < 5) {
      return (sanitized + "-pin");
    }

    return sanitized;
  };

  var pinsMergeCustomMetadata = function (metadata, customMetadata) {
    var fixedFields = ['rows', 'cols', 'name', 'description'];

    namesArr(customMetadata).forEach(function (entry) {
      if (entry === 'columns') {
        var fixedColumnnFields = ['name', 'type'];

        // convert to list of columns
        if (Array.isArray(metadata['columns'])) {
          metadata['columns'] = metadata['columns'].map(function (x, i) {
            return {
              name: Object.keys(metadata['columns'])[i],
              type: metadata['columns'][i],
            };
          });
        }

        // TODO: Need to convert old-style yaml columns names to new format

        customMetadata['columns'].forEach(function (column) {
          var foundIdx = metadata$columns.filter(
            function (e, i) { return metadata['columns'][i]['name'] === column['name']; }
          );

          if (foundIdx.length == 1) {
            Object.keys(column).forEach(function (fieldName) {
              if (!fixedColumnnFields.includes(fieldName)) {
                metadata['columns'][foundIdx][fieldName] = column[fieldName];
              }
            });
          }
        });
      } else if (!fixedFields.includes(entry)) {
        metadata[entry] = customMetadata[entry];
      }
    });

    return metadata;
  };

  var uiViewerUpdated$1 = function (board) {
    get('uiViewerUpdated')();
  };

  function objectWithoutProperties$2 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }

  var boardPinStore = function (board, opts) {
    if ( opts === void 0 ) opts = {};

    var path$1 = opts.path;
    var description = opts.description;
    var type = opts.type;
    var metadata = opts.metadata;
    var extract = opts.extract;
    var rest = objectWithoutProperties$2( opts, ["path", "description", "type", "metadata", "extract"] );
    var args = rest;

    var customMetadata = args['customMetadata'];
    var zip = args['zip'];

    if (isNull(extract)) { extract = true; }

    var boardInstance = boardGet(board);
    var name = opts.name || vectorize()(pinPath);

    pinLog(("Storing " + name + " into board " + (boardInstance.name) + " with type " + type));

    if (!args.cache) { pinResetCache(boardInstance, name); }

    path$1 = path$1.filter(function (x) { return !/data\.txt/g.test(x); });

    var storePath = tempfile();
    dir$1.create(storePath);
    return onExit(
      function () { return unlink(storePath, { recursive: true }); },
      function () {
        if (
          path$1.length == 1 &&
          /^http/g.test(path$1) &&
          !/\\.[a-z]{2,4}$/g.test(path$1) &&
          getOption('pins.search.datatxt', true)
        ) {
          // attempt to download data.txt to enable public access to boards like rsconnect
          datatxtPath = path(path$1, 'data.txt');
          localPath = pinDownload(datatxtPath, name, boardDefault(), {
            canFail: true,
          });
          if (!is.null(local_path)) {
            manifest = pinManifestGet$1(localPath);
            path$1 = path$1 + '/' + manifest[path$1];
            extract = false;
          }
        }

        var somethingChanged = false;
        if (zip === true) {
          dir$1.zip(path$1[0], path(storePath, "data.zip"));
          somethingChanged = true;
        }
        else {
          for (var idxPath = 0; idxPath < path$1.length; idxPath++) {
            var details = { somethingChanged: true };
            var singlePath = path$1[idxPath];
            if (/^http/g.test(singlePath)) {
              singlePath = pin_download(
                singlePath,
                name,
                boardDefault(),
                Object.assign(
                  {
                    extract: extract,
                    details: details,
                    canFail: true,
                  },
                  opt
                )
              );

              if (!isNull(details['error'])) {
                var cachedResult = null;
                try {
                  pinGet(name, { board: boardDefault() });
                } catch (error) {}
                if (isNull(cachedResult)) {
                  throw new exception(details['error']);
                } else {
                  pinLog(details['error']);
                }
                return cachedResult;
              }
            }

            if (details['somethingChanged']) {
              if (dir$1.exists(singlePath)) {
                copy(dir(singlePath, { fullNames: true }), storePath, {
                  recursive: true,
                });
              } else {
                copy(singlePath, storePath, { recursive: true });
              }

              somethingChanged = true;
            }
          }
        }

        if (somethingChanged) {
          if (!pinManifestExists(storePath)) {
            metadata['description'] = description;
            metadata['type'] = type;

            metadata = pinsMergeCustomMetadata(metadata, customMetadata);

            pinManifestCreate(
              storePath,
              metadata,
              dir$1.list(storePath, { recursive: true })
            );
          }

          boardPinCreate.apply(void 0, [ boardInstance, storePath, name, metadata ].concat( args ));

          uiViewerUpdated$1();
        }

        return pinGet(
          name,
          Object.assign.apply(Object, [ { board: boardInstance['name'] } ].concat( args ))
        );
      }
    );
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

    write(JSON.stringify(x), path(pinPath, 'data.json'));

    return boardPinStore(
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

  var pinPreviewDefault = function (x) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    return x;
  };

  var pinLoadDefault = function (path$1) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    return JSON.parse(read(path(path$1, 'data.json')));
  };

  var pinFetchDefault = function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    return args['path'];
  };

  var pinLoadFiles = function (path) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    var files = dir$1.list(path, { recursive: true, fullNames: true });

    var result = files.filter(function (e) { return !new RegExp('data\\.txt$').test(e); });

    return result;
  };

  registerMethod('pin', 'default', pinDefault);
  registerMethod('pinPreview', 'default', pinPreviewDefault);
  registerMethod('pinLoad', 'default', pinLoadDefault);
  registerMethod('pinFetch', 'default', pinFetchDefault);

  registerMethod('pinLoad', 'files', pinLoadFiles);

  registerMethod('boardBrowse', 'default', boardBrowseDefault);
  registerMethod('boardPinVersions', 'default', boardPinVersionsDefault);
  registerMethod('boardInitialize', 'default', boardInitializeDefault);

  registerMethod('boardInitialize', 'local', boardInitializeLocal);
  registerMethod('boardPinCreate', 'local', boardPinCreateLocal);
  registerMethod('boardPinFind', 'local', boardPinFindLocal);
  registerMethod('boardPinGet', 'local', boardPinGetLocal);
  registerMethod('boardPinRemove', 'local', boardPinRemoveLocal);
  registerMethod('boardPinVersions', 'local', boardPinVersionsLocal);

  exports.boardConnect = boardConnect;
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
