var pins = (function (exports) {
  'use strict';

  var HOST_CALLBACKS = {};
  var get = function (name) {
      if (Object.keys(HOST_CALLBACKS).includes(name)) 
          { return HOST_CALLBACKS[name]; }
       else 
          { return function () {
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
      set: set
  };

  function isNull(obj) {
      return obj === null || typeof obj === 'undefined';
  }

  var getOption = function (name, defval) {
      var option = get('getOption')(name);
      option = option === '' ? null : option;
      return !isNull(option) ? option : defval;
  };

  function unique(arr) {
      function onlyUnique(value, index, self) {
          return self.indexOf(value) === index;
      }
      
      return arr.filter(onlyUnique);
  }

  function concat(arr, value) {
      if (value !== null) {
          arr = arr.concat(value);
      }
      return arr;
  }

  function vectorize(func) {
      return function (x) {
          var args = [], len = arguments.length - 1;
          while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

          var result = [];
          for (var idx = 0;idx > x.length; idx++) {
              result.push(fun.apply(void 0, [ x[idx] ].concat( args )));
          }
          return result;
      };
  }

  function ensure(obj) {
      if (!Array.isArray(obj)) {
          return [obj];
      } else {
          return obj;
      }
  }

  function getOnly(obj) {
      if (Array.isArray(obj)) {
          if (obj.length == 1) {
              obj = obj[0];
          } else {
              throw new Error('Array has more than one element but expecting only one');
          }
      }
      return obj;
  }

  function maybeOne(obj) {
      if (Array.isArray(obj) && obj.length == 1) {
          return obj[0];
      }
      return obj;
  }

  function all(arr, callback) {
      for (var idx = 0;idx < arr.length; idx++) {
          if (!callback(arr[idx])) 
              { return false; }
      }
      return true;
  }

  var uiViewerRegister = function (board, boardCall) {
      get('uiViewerRegister')(board, boardCall);
  };
  var uiViewerUpdated = function (board) {
      get('uiViewerUpdated')(board);
  };
  var uiViewerClose = function (board) {
      get('uiViewerClose')(board);
  };

  var BOARDS_REGISTERED = {};
  var list = function () { return Object.keys(BOARDS_REGISTERED); };
  var get$1 = function (name) { return BOARDS_REGISTERED[name]; };
  var set$1 = function (name, board) { return BOARDS_REGISTERED[name] = board; };
  var remove = function (name) { return delete BOARDS_REGISTERED[name]; };

  var userCacheDir = function (name) { return callbacks.get('userCacheDir')(name); };

  function boardCachePath() {
      return getOption('pins.path', userCacheDir('pins'));
  }

  function tempfile() {
      return callbacks.get('tempfile')();
  }

  function basename(filePath) {
      return callbacks.get('basename')(filePath);
  }

  function readLines(filePath) {
      return callbacks.get('readLines')(filePath);
  }

  function writeLines(filePath, content) {
      return callbacks.get('writeLines')(filePath, content.filter(Boolean));
  }

  function supportsLinks() {
      return callbacks.get('supportsLinks')();
  }

  var dir = Object.freeze({
      create: function create(dirPath, options) {
          if ( options === void 0 ) options = {
          recursive: false
      };

          return callbacks.get('dirCreate')(dirPath, options);
      },
      exists: function exists(dirPath) {
          return callbacks.get('dirExists')(dirPath);
      },
      list: function list(dirPath, ref) {
          if ( ref === void 0 ) ref = {
          recursive: false,
          fullNames: false
      };
          var recursive = ref.recursive;
          var fullNames = ref.fullNames;

          return callbacks.get('dirList')(getOnly(dirPath), recursive, fullNames);
      },
      remove: function remove(dirPath, args) {
          dirPath = ensure(dirPath);
          return dirPath.map(function (e) { return callbacks.get('dirRemove')(e, args); });
      },
      zip: function zip(dirPath, zipFile, args) {
          return callbacks.get('dirZip')(dirPath, zipFile, args);
      }
  });
  var tools = Object.freeze({
      filePathSansExt: function filePathSansExt(filePath) {
          return filePath.replace(/\.[^/.]+$/, '');
      },
      fileExt: function fileExt(filePath) {
          return filePath.match(/\.[^/.]+$/, '')[0];
      }
  });
  function write(object, path) {
      return callbacks.get('fileWrite')(object, path);
  }

  function read(path, encoding) {
      if ( encoding === void 0 ) encoding = 'utf8';

      return callbacks.get('fileRead')(path, encoding);
  }

  function path(path1, path2) {
      return callbacks.get('filePath')(path1, path2);
  }

  var normalizePath = function (path, ref) {
      if ( ref === void 0 ) ref = {
      winslash: '\\',
      mustWork: false
  };
      var winslash = ref.winslash;
      var mustWork = ref.mustWork;

      return path;
  };
  function absolutePath(path) {
      return path;
  }

  function dirname(path) {
      return path.substring(path.lastIndexOf('/')).includes('.') ? path.replace(/[^\/]+$/, '') : path;
  }

  function lockFile(path, timeout) {
      return callbacks.get('fileExists')(path);
  }

  function unlockFile(path) {
      return callbacks.get('fileExists')(path);
  }

  function fileRemove(path) {
      return callbacks.get('fileRemove')(path);
  }

  function fileExists(path) {
      return callbacks.get('fileExists')(path);
  }

  function copy(from, to, ref) {
      if ( ref === void 0 ) ref = {
      recursive: true
  };
      var recursive = ref.recursive;

      return callbacks.get('fileCopy')(from, to, recursive);
  }

  function createLink(from, to) {
      return callbacks.get('createLink')(path);
  }

  function fileSize(path) {
      return callbacks.get('fileSize')(path);
  }

  var md5 = function (str, key) { return callbacks.get('md5')(str, key); };

  function dataFrame(data, columns) {
      var df = [];
      if (!isNull(data)) {
          df = data;
      }
      df.columns = columns;
      return df;
  }

  function dfColNames(df) {
      if (df.hasOwnProperty('columns')) 
          { return Object.keys(df['columns']); }
      if (df.length > 0) 
          { return Object.keys(df[0]); }
      return [];
  }

  function dfCBind(df1, df2) {
      var rows = df1.map(function (left, idx) {
          var row = {};
          Object.assign(row, left);
          Object.assign(row, df2[idx]);
          return row;
      });
      var cols = Object.assign({}, df1.columns);
      Object.assign(cols, df2.columns);
      return dataFrame(rows, cols);
  }

  function dfColRemove(df, col) {
      var cols = {};
      Object.assign(cols, df.columns);
      if (Object.keys(cols).includes(col)) 
          { delete cols[col]; }
      var rows = df.map(function (old) {
          var row = {};
          Object.assign(row, old);
          if (Object.keys(row).includes(col)) 
              { delete row[col]; }
          return row;
      });
      return dataFrame(rows, cols);
  }

  function dfIsDataFrame(obj) {
      if (Array.isArray(obj)) {
          if (obj.length === 0 || typeof obj.columns != 'undefined') 
              { return true; }
          if (obj.length === 1 && typeof obj[0] === 'object') {
              return true;
          }
          if (obj.length > 1) {
              var isDataFrame = true;
              for (var idxRow = 1;idxRow < obj.length; idxRow++) {
                  if (typeof obj[idxRow] !== 'object' || obj[idxRow].length !== obj[0].length) {
                      isDataFrame = false;
                      break;
                  }
              }
              return isDataFrame;
          }
      }
      return false;
  }

  function boardDefault() {
      return getOption('pins.board', 'local');
  }

  function boardLocalStorage(board) {
      if (typeof board === 'string') {
          board = boardGet$1(board);
      }
      var path$1 = board['cache'];
      var componentPath = path(path$1, board['name']);
      if (!dir.exists(componentPath)) {
          dir.create(componentPath, {
              recursive: true
          });
      }
      return normalizePath(componentPath, {
          mustWork: false
      });
  }

  var isAsync = function (func) { return !(!func.then); };
  var onExit = function () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      return new Promise(function ($return, $error) {
      var error, result, idx;
      error = null;
      result = null;
      var $Try_1_Post = function () {
          try {
              idx = 0;
              var $Loop_3_trampoline;
              function $Loop_3_step() {
                  idx++;
                  return $Loop_3;
              }
              
              function $Loop_3() {
                  if (idx < args.length - 2) {
                      if (isAsync(args[idx])) {
                          return args[idx]().then((function ($await_7) {
                              try {
                                  return $If_5.call(this);
                              } catch ($boundEx) {
                                  return $error($boundEx);
                              }
                          }).bind(this), $error);
                      } else {
                          args[idx]();
                          return $If_5.call(this);
                      }
                      function $If_5() {
                          return $Loop_3_step;
                      }
                      
                  } else 
                      { return [1]; }
              }
              
              return ($Loop_3_trampoline = (function (q) {
                  while (q) {
                      if (q.then) 
                          { return void q.then($Loop_3_trampoline, $error); }
                      try {
                          if (q.pop) 
                              { if (q.length) 
                              { return q.pop() ? $Loop_3_exit.call(this) : q; }
                           else 
                              { q = $Loop_3_step; } }
                           else 
                              { q = q.call(this); }
                      } catch (_exception) {
                          return $error(_exception);
                      }
                  }
              }).bind(this))($Loop_3);
              function $Loop_3_exit() {
                  if (error) 
                      { return $error(error); }
                  return $return(result);
              }
              
          } catch ($boundEx) {
              return $error($boundEx);
          }
      };
      var $Try_1_Catch = function (err) {
          try {
              error = err;
              return $Try_1_Post();
          } catch ($boundEx) {
              return $error($boundEx);
          }
      };
      try {
          return new Promise(function ($return, $error) {
              if (isAsync(args[args.length - 1])) {
                  return args[args.length - 1]().then($return, $error);
              }
              return $return(args[args.length - 1]());
          }).then(function ($await_9) {
              try {
                  result = $await_9;
                  return $Try_1_Post();
              } catch ($boundEx) {
                  return $Try_1_Catch($boundEx);
              }
          }, $Try_1_Catch);
      } catch (err) {
          $Try_1_Catch(err);
      }
  });
  };

  var pinLog = function () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      if (getOption('pins.verbose', true)) {
          callbacks.get('pinLog')(args.join(''));
      }
  };
  var _pinDebug = false;
  var pinDebug = function (params) {
      if (_pinDebug) 
          { return; }
      _pinDebug = true;
      if (getOption('pins.debug', true)) {
          var name = params.name;
          var level = params.level + 1;
          params.level = (params.line = (params.name = undefined));
          callbacks.get('pinLog')('--'.repeat(level) + name + '(' + JSON.stringify(params).substring(0, 90) + ')');
      }
      _pinDebug = false;
  };

  function isNothing(subject) {
      return typeof subject === 'undefined' || subject === null;
  }

  function isObject(subject) {
      return typeof subject === 'object' && subject !== null;
  }

  function toArray(sequence) {
      if (Array.isArray(sequence)) 
          { return sequence; }
       else if (isNothing(sequence)) 
          { return []; }
      return [sequence];
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
      return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
  }

  var isNothing_1 = isNothing;
  var isObject_1 = isObject;
  var toArray_1 = toArray;
  var repeat_1 = repeat;
  var isNegativeZero_1 = isNegativeZero;
  var extend_1 = extend;




  var common = {
  	isNothing: isNothing_1,
  	isObject: isObject_1,
  	toArray: toArray_1,
  	repeat: repeat_1,
  	isNegativeZero: isNegativeZero_1,
  	extend: extend_1
  };

  function YAMLException(reason, mark) {
      Error.call(this);
      this.name = 'YAMLException';
      this.reason = reason;
      this.mark = mark;
      this.message = (this.reason || '(unknown reason)') + (this.mark ? ' ' + this.mark.toString() : '');
      if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
      } else {
          this.stack = new Error().stack || '';
      }
  }

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
  var exception = YAMLException;

  function Mark(name, buffer, position, line, column) {
      this.name = name;
      this.buffer = buffer;
      this.position = position;
      this.line = line;
      this.column = column;
  }

  Mark.prototype.getSnippet = function getSnippet(indent, maxLength) {
      var head, start, tail, end, snippet;
      if (!this.buffer) 
          { return null; }
      indent = indent || 4;
      maxLength = maxLength || 75;
      head = '';
      start = this.position;
      while (start > 0 && '\x00\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(start - 1)) === -1) {
          start -= 1;
          if (this.position - start > maxLength / 2 - 1) {
              head = ' ... ';
              start += 5;
              break;
          }
      }
      tail = '';
      end = this.position;
      while (end < this.buffer.length && '\x00\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(end)) === -1) {
          end += 1;
          if (end - this.position > maxLength / 2 - 1) {
              tail = ' ... ';
              end -= 5;
              break;
          }
      }
      snippet = this.buffer.slice(start, end);
      return common.repeat(' ', indent) + head + snippet + tail + '\n' + common.repeat(' ', indent + this.position - start + head.length) + '^';
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

  var TYPE_CONSTRUCTOR_OPTIONS = ['kind','resolve','construct','instanceOf','predicate',
      'represent','defaultStyle','styleAliases'];
  var YAML_NODE_KINDS = ['scalar','sequence','mapping'];
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
              throw new exception('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
          }
      });
      this.tag = tag;
      this.kind = options['kind'] || null;
      this.resolve = options['resolve'] || function () {
          return true;
      };
      this.construct = options['construct'] || function (data) {
          return data;
      };
      this.instanceOf = options['instanceOf'] || null;
      this.predicate = options['predicate'] || null;
      this.represent = options['represent'] || null;
      this.defaultStyle = options['defaultStyle'] || null;
      this.styleAliases = compileStyleAliases(options['styleAliases'] || null);
      if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
          throw new exception('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
      }
  }

  var type = Type;

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

  function compileMap() {
      var arguments$1 = arguments;

      var result = {
          scalar: {},
          sequence: {},
          mapping: {},
          fallback: {}
      }, index, length;
      function collectType(type) {
          result[type.kind][type.tag] = (result['fallback'][type.tag] = type);
      }
      
      for (index = 0, length = arguments.length; index < length; index += 1) {
          arguments$1[index].forEach(collectType);
      }
      return result;
  }

  function Schema(definition) {
      this.include = definition.include || [];
      this.implicit = definition.implicit || [];
      this.explicit = definition.explicit || [];
      this.implicit.forEach(function (type) {
          if (type.loadKind && type.loadKind !== 'scalar') {
              throw new exception('There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.');
          }
      });
      this.compiledImplicit = compileList(this, 'implicit', []);
      this.compiledExplicit = compileList(this, 'explicit', []);
      this.compiledTypeMap = compileMap(this.compiledImplicit, this.compiledExplicit);
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
              throw new exception('Wrong number of arguments for Schema.create function');
      }
      schemas = common.toArray(schemas);
      types = common.toArray(types);
      if (!schemas.every(function (schema) {
          return schema instanceof Schema;
      })) {
          throw new exception('Specified list of super schemas (or a single Schema object) contains a non-Schema object.');
      }
      if (!types.every(function (type$1) {
          return type$1 instanceof type;
      })) {
          throw new exception('Specified list of YAML types (or a single Type object) contains a non-Type object.');
      }
      return new Schema({
          include: schemas,
          explicit: types
      });
  };
  var schema = Schema;

  var str = new type('tag:yaml.org,2002:str', {
      kind: 'scalar',
      construct: function (data) {
          return data !== null ? data : '';
      }
  });

  var seq = new type('tag:yaml.org,2002:seq', {
      kind: 'sequence',
      construct: function (data) {
          return data !== null ? data : [];
      }
  });

  var map = new type('tag:yaml.org,2002:map', {
      kind: 'mapping',
      construct: function (data) {
          return data !== null ? data : {};
      }
  });

  var failsafe = new schema({
      explicit: [str,seq,map]
  });

  function resolveYamlNull(data) {
      if (data === null) 
          { return true; }
      var max = data.length;
      return max === 1 && data === '~' || max === 4 && (data === 'null' || data === 'Null' || data === 'NULL');
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
          canonical: function () {
              return '~';
          },
          lowercase: function () {
              return 'null';
          },
          uppercase: function () {
              return 'NULL';
          },
          camelcase: function () {
              return 'Null';
          }
      },
      defaultStyle: 'lowercase'
  });

  function resolveYamlBoolean(data) {
      if (data === null) 
          { return false; }
      var max = data.length;
      return max === 4 && (data === 'true' || data === 'True' || data === 'TRUE') || max === 5 && (data === 'false' || data === 'False' || data === 'FALSE');
  }

  function constructYamlBoolean(data) {
      return data === 'true' || data === 'True' || data === 'TRUE';
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
          lowercase: function (object) {
              return object ? 'true' : 'false';
          },
          uppercase: function (object) {
              return object ? 'TRUE' : 'FALSE';
          },
          camelcase: function (object) {
              return object ? 'True' : 'False';
          }
      },
      defaultStyle: 'lowercase'
  });

  function isHexCode(c) {
      return 0x30 <= c && c <= 0x39 || 0x41 <= c && c <= 0x46 || 0x61 <= c && c <= 0x66;
  }

  function isOctCode(c) {
      return 0x30 <= c && c <= 0x37;
  }

  function isDecCode(c) {
      return 0x30 <= c && c <= 0x39;
  }

  function resolveYamlInteger(data) {
      if (data === null) 
          { return false; }
      var max = data.length, index = 0, hasDigits = false, ch;
      if (!max) 
          { return false; }
      ch = data[index];
      if (ch === '-' || ch === '+') {
          ch = data[++index];
      }
      if (ch === '0') {
          if (index + 1 === max) 
              { return true; }
          ch = data[++index];
          if (ch === 'b') {
              index++;
              for (; index < max; index++) {
                  ch = data[index];
                  if (ch === '_') 
                      { continue; }
                  if (ch !== '0' && ch !== '1') 
                      { return false; }
                  hasDigits = true;
              }
              return hasDigits && ch !== '_';
          }
          if (ch === 'x') {
              index++;
              for (; index < max; index++) {
                  ch = data[index];
                  if (ch === '_') 
                      { continue; }
                  if (!isHexCode(data.charCodeAt(index))) 
                      { return false; }
                  hasDigits = true;
              }
              return hasDigits && ch !== '_';
          }
          for (; index < max; index++) {
              ch = data[index];
              if (ch === '_') 
                  { continue; }
              if (!isOctCode(data.charCodeAt(index))) 
                  { return false; }
              hasDigits = true;
          }
          return hasDigits && ch !== '_';
      }
      if (ch === '_') 
          { return false; }
      for (; index < max; index++) {
          ch = data[index];
          if (ch === '_') 
              { continue; }
          if (ch === ':') 
              { break; }
          if (!isDecCode(data.charCodeAt(index))) {
              return false;
          }
          hasDigits = true;
      }
      if (!hasDigits || ch === '_') 
          { return false; }
      if (ch !== ':') 
          { return true; }
      return /^(:[0-5]?[0-9])+$/.test(data.slice(index));
  }

  function constructYamlInteger(data) {
      var value = data, sign = 1, ch, base, digits = [];
      if (value.indexOf('_') !== -1) {
          value = value.replace(/_/g, '');
      }
      ch = value[0];
      if (ch === '-' || ch === '+') {
          if (ch === '-') 
              { sign = -1; }
          value = value.slice(1);
          ch = value[0];
      }
      if (value === '0') 
          { return 0; }
      if (ch === '0') {
          if (value[1] === 'b') 
              { return sign * parseInt(value.slice(2), 2); }
          if (value[1] === 'x') 
              { return sign * parseInt(value, 16); }
          return sign * parseInt(value, 8);
      }
      if (value.indexOf(':') !== -1) {
          value.split(':').forEach(function (v) {
              digits.unshift(parseInt(v, 10));
          });
          value = 0;
          base = 1;
          digits.forEach(function (d) {
              value += d * base;
              base *= 60;
          });
          return sign * value;
      }
      return sign * parseInt(value, 10);
  }

  function isInteger(object) {
      return Object.prototype.toString.call(object) === '[object Number]' && (object % 1 === 0 && !common.isNegativeZero(object));
  }

  var int_1 = new type('tag:yaml.org,2002:int', {
      kind: 'scalar',
      resolve: resolveYamlInteger,
      construct: constructYamlInteger,
      predicate: isInteger,
      represent: {
          binary: function (obj) {
              return obj >= 0 ? '0b' + obj.toString(2) : '-0b' + obj.toString(2).slice(1);
          },
          octal: function (obj) {
              return obj >= 0 ? '0' + obj.toString(8) : '-0' + obj.toString(8).slice(1);
          },
          decimal: function (obj) {
              return obj.toString(10);
          },
          hexadecimal: function (obj) {
              return obj >= 0 ? '0x' + obj.toString(16).toUpperCase() : '-0x' + obj.toString(16).toUpperCase().slice(1);
          }
      },
      defaultStyle: 'decimal',
      styleAliases: {
          binary: [2,'bin'],
          octal: [8,'oct'],
          decimal: [10,'dec'],
          hexadecimal: [16,'hex']
      }
  });

  var YAML_FLOAT_PATTERN = new RegExp('^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?' + '|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?' + '|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*' + '|[-+]?\\.(?:inf|Inf|INF)' + '|\\.(?:nan|NaN|NAN))$');
  function resolveYamlFloat(data) {
      if (data === null) 
          { return false; }
      if (!YAML_FLOAT_PATTERN.test(data) || data[data.length - 1] === '_') {
          return false;
      }
      return true;
  }

  function constructYamlFloat(data) {
      var value, sign, base, digits;
      value = data.replace(/_/g, '').toLowerCase();
      sign = value[0] === '-' ? -1 : 1;
      digits = [];
      if ('+-'.indexOf(value[0]) >= 0) {
          value = value.slice(1);
      }
      if (value === '.inf') {
          return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
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
              case 'lowercase':
                  return '.nan';
              case 'uppercase':
                  return '.NAN';
              case 'camelcase':
                  return '.NaN';
          }
      } else if (Number.POSITIVE_INFINITY === object) {
          switch (style) {
              case 'lowercase':
                  return '.inf';
              case 'uppercase':
                  return '.INF';
              case 'camelcase':
                  return '.Inf';
          }
      } else if (Number.NEGATIVE_INFINITY === object) {
          switch (style) {
              case 'lowercase':
                  return '-.inf';
              case 'uppercase':
                  return '-.INF';
              case 'camelcase':
                  return '-.Inf';
          }
      } else if (common.isNegativeZero(object)) {
          return '-0.0';
      }
      res = object.toString(10);
      return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace('e', '.e') : res;
  }

  function isFloat(object) {
      return Object.prototype.toString.call(object) === '[object Number]' && (object % 1 !== 0 || common.isNegativeZero(object));
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
      include: [failsafe],
      implicit: [_null,bool,int_1,
          float_1]
  });

  var core = new schema({
      include: [json]
  });

  var YAML_DATE_REGEXP = new RegExp('^([0-9][0-9][0-9][0-9])' + '-([0-9][0-9])' + '-([0-9][0-9])$');
  var YAML_TIMESTAMP_REGEXP = new RegExp('^([0-9][0-9][0-9][0-9])' + '-([0-9][0-9]?)' + '-([0-9][0-9]?)' + '(?:[Tt]|[ \\t]+)' + '([0-9][0-9]?)' + ':([0-9][0-9])' + ':([0-9][0-9])' + '(?:\\.([0-9]*))?' + '(?:[ \\t]*(Z|([-+])([0-9][0-9]?)' + '(?::([0-9][0-9]))?))?$');
  function resolveYamlTimestamp(data) {
      if (data === null) 
          { return false; }
      if (YAML_DATE_REGEXP.exec(data) !== null) 
          { return true; }
      if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) 
          { return true; }
      return false;
  }

  function constructYamlTimestamp(data) {
      var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
      match = YAML_DATE_REGEXP.exec(data);
      if (match === null) 
          { match = YAML_TIMESTAMP_REGEXP.exec(data); }
      if (match === null) 
          { throw new Error('Date resolve error'); }
      year = +match[1];
      month = +match[2] - 1;
      day = +match[3];
      if (!match[4]) {
          return new Date(Date.UTC(year, month, day));
      }
      hour = +match[4];
      minute = +match[5];
      second = +match[6];
      if (match[7]) {
          fraction = match[7].slice(0, 3);
          while (fraction.length < 3) {
              fraction += '0';
          }
          fraction = +fraction;
      }
      if (match[9]) {
          tz_hour = +match[10];
          tz_minute = +(match[11] || 0);
          delta = (tz_hour * 60 + tz_minute) * 60000;
          if (match[9] === '-') 
              { delta = -delta; }
      }
      date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
      if (delta) 
          { date.setTime(date.getTime() - delta); }
      return date;
  }

  function representYamlTimestamp(object) {
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

  var NodeBuffer;
  try {
      var _require = commonjsRequire;
      NodeBuffer = _require('buffer').Buffer;
  } catch (_) {}

  var BASE64_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r';
  function resolveYamlBinary(data) {
      if (data === null) 
          { return false; }
      var code, idx, bitlen = 0, max = data.length, map = BASE64_MAP;
      for (idx = 0; idx < max; idx++) {
          code = map.indexOf(data.charAt(idx));
          if (code > 64) 
              { continue; }
          if (code < 0) 
              { return false; }
          bitlen += 6;
      }
      return bitlen % 8 === 0;
  }

  function constructYamlBinary(data) {
      var idx, tailbits, input = data.replace(/[\r\n=]/g, ''), max = input.length, map = BASE64_MAP, bits = 0, result = [];
      for (idx = 0; idx < max; idx++) {
          if (idx % 4 === 0 && idx) {
              result.push(bits >> 16 & 0xFF);
              result.push(bits >> 8 & 0xFF);
              result.push(bits & 0xFF);
          }
          bits = bits << 6 | map.indexOf(input.charAt(idx));
      }
      tailbits = max % 4 * 6;
      if (tailbits === 0) {
          result.push(bits >> 16 & 0xFF);
          result.push(bits >> 8 & 0xFF);
          result.push(bits & 0xFF);
      } else if (tailbits === 18) {
          result.push(bits >> 10 & 0xFF);
          result.push(bits >> 2 & 0xFF);
      } else if (tailbits === 12) {
          result.push(bits >> 4 & 0xFF);
      }
      if (NodeBuffer) {
          return NodeBuffer.from ? NodeBuffer.from(result) : new NodeBuffer(result);
      }
      return result;
  }

  function representYamlBinary(object) {
      var result = '', bits = 0, idx, tail, max = object.length, map = BASE64_MAP;
      for (idx = 0; idx < max; idx++) {
          if (idx % 3 === 0 && idx) {
              result += map[bits >> 18 & 0x3F];
              result += map[bits >> 12 & 0x3F];
              result += map[bits >> 6 & 0x3F];
              result += map[bits & 0x3F];
          }
          bits = (bits << 8) + object[idx];
      }
      tail = max % 3;
      if (tail === 0) {
          result += map[bits >> 18 & 0x3F];
          result += map[bits >> 12 & 0x3F];
          result += map[bits >> 6 & 0x3F];
          result += map[bits & 0x3F];
      } else if (tail === 2) {
          result += map[bits >> 10 & 0x3F];
          result += map[bits >> 4 & 0x3F];
          result += map[bits << 2 & 0x3F];
          result += map[64];
      } else if (tail === 1) {
          result += map[bits >> 2 & 0x3F];
          result += map[bits << 4 & 0x3F];
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
  var _toString = Object.prototype.toString;
  function resolveYamlOmap(data) {
      if (data === null) 
          { return true; }
      var objectKeys = [], index, length, pair, pairKey, pairHasKey, object = data;
      for (index = 0, length = object.length; index < length; index += 1) {
          pair = object[index];
          pairHasKey = false;
          if (_toString.call(pair) !== '[object Object]') 
              { return false; }
          for (pairKey in pair) {
              if (_hasOwnProperty.call(pair, pairKey)) {
                  if (!pairHasKey) 
                      { pairHasKey = true; }
                   else 
                      { return false; }
              }
          }
          if (!pairHasKey) 
              { return false; }
          if (objectKeys.indexOf(pairKey) === -1) 
              { objectKeys.push(pairKey); }
           else 
              { return false; }
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
      if (data === null) 
          { return true; }
      var index, length, pair, keys, result, object = data;
      result = new Array(object.length);
      for (index = 0, length = object.length; index < length; index += 1) {
          pair = object[index];
          if (_toString$1.call(pair) !== '[object Object]') 
              { return false; }
          keys = Object.keys(pair);
          if (keys.length !== 1) 
              { return false; }
          result[index] = [keys[0],pair[keys[0]]];
      }
      return true;
  }

  function constructYamlPairs(data) {
      if (data === null) 
          { return []; }
      var index, length, pair, keys, result, object = data;
      result = new Array(object.length);
      for (index = 0, length = object.length; index < length; index += 1) {
          pair = object[index];
          keys = Object.keys(pair);
          result[index] = [keys[0],pair[keys[0]]];
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
      if (data === null) 
          { return true; }
      var key, object = data;
      for (key in object) {
          if (_hasOwnProperty$1.call(object, key)) {
              if (object[key] !== null) 
                  { return false; }
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
      include: [core],
      implicit: [timestamp,merge],
      explicit: [binary,omap,pairs,
          set$2]
  });

  function resolveJavascriptUndefined() {
      return true;
  }

  function constructJavascriptUndefined() {
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
      if (data === null) 
          { return false; }
      if (data.length === 0) 
          { return false; }
      var regexp = data, tail = /\/([gim]*)$/.exec(data), modifiers = '';
      if (regexp[0] === '/') {
          if (tail) 
              { modifiers = tail[1]; }
          if (modifiers.length > 3) 
              { return false; }
          if (regexp[regexp.length - modifiers.length - 1] !== '/') 
              { return false; }
      }
      return true;
  }

  function constructJavascriptRegExp(data) {
      var regexp = data, tail = /\/([gim]*)$/.exec(data), modifiers = '';
      if (regexp[0] === '/') {
          if (tail) 
              { modifiers = tail[1]; }
          regexp = regexp.slice(1, regexp.length - modifiers.length - 1);
      }
      return new RegExp(regexp, modifiers);
  }

  function representJavascriptRegExp(object) {
      var result = '/' + object.source + '/';
      if (object.global) 
          { result += 'g'; }
      if (object.multiline) 
          { result += 'm'; }
      if (object.ignoreCase) 
          { result += 'i'; }
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
  try {
      var _require$1 = commonjsRequire;
      esprima = _require$1('esprima');
  } catch (_) {
      if (typeof window !== 'undefined') 
          { esprima = window.esprima; }
  }

  function resolveJavascriptFunction(data) {
      if (data === null) 
          { return false; }
      try {
          var source = '(' + data + ')', ast = esprima.parse(source, {
              range: true
          });
          if (ast.type !== 'Program' || ast.body.length !== 1 || ast.body[0].type !== 'ExpressionStatement' || ast.body[0].expression.type !== 'ArrowFunctionExpression' && ast.body[0].expression.type !== 'FunctionExpression') {
              return false;
          }
          return true;
      } catch (err) {
          return false;
      }
  }

  function constructJavascriptFunction(data) {
      var source = '(' + data + ')', ast = esprima.parse(source, {
          range: true
      }), params = [], body;
      if (ast.type !== 'Program' || ast.body.length !== 1 || ast.body[0].type !== 'ExpressionStatement' || ast.body[0].expression.type !== 'ArrowFunctionExpression' && ast.body[0].expression.type !== 'FunctionExpression') {
          throw new Error('Failed to resolve function');
      }
      ast.body[0].expression.params.forEach(function (param) {
          params.push(param.name);
      });
      body = ast.body[0].expression.body.range;
      if (ast.body[0].expression.body.type === 'BlockStatement') {
          return new Function(params, source.slice(body[0] + 1, body[1] - 1));
      }
      return new Function(params, 'return ' + source.slice(body[0], body[1]));
  }

  function representJavascriptFunction(object) {
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

  var default_full = (schema.DEFAULT = new schema({
      include: [default_safe],
      explicit: [_undefined,regexp,_function]
  }));

  var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;
  var CONTEXT_FLOW_IN = 1;
  var CONTEXT_FLOW_OUT = 2;
  var CONTEXT_BLOCK_IN = 3;
  var CONTEXT_BLOCK_OUT = 4;
  var CHOMPING_CLIP = 1;
  var CHOMPING_STRIP = 2;
  var CHOMPING_KEEP = 3;
  var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
  var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
  var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
  var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
  var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
  function _class(obj) {
      return Object.prototype.toString.call(obj);
  }

  function is_EOL(c) {
      return c === 0x0A || c === 0x0D;
  }

  function is_WHITE_SPACE(c) {
      return c === 0x09 || c === 0x20;
  }

  function is_WS_OR_EOL(c) {
      return c === 0x09 || c === 0x20 || c === 0x0A || c === 0x0D;
  }

  function is_FLOW_INDICATOR(c) {
      return c === 0x2C || c === 0x5B || c === 0x5D || c === 0x7B || c === 0x7D;
  }

  function fromHexCode(c) {
      var lc;
      if (0x30 <= c && c <= 0x39) {
          return c - 0x30;
      }
      lc = c | 0x20;
      if (0x61 <= lc && lc <= 0x66) {
          return lc - 0x61 + 10;
      }
      return -1;
  }

  function escapedHexLen(c) {
      if (c === 0x78) {
          return 2;
      }
      if (c === 0x75) {
          return 4;
      }
      if (c === 0x55) {
          return 8;
      }
      return 0;
  }

  function fromDecimalCode(c) {
      if (0x30 <= c && c <= 0x39) {
          return c - 0x30;
      }
      return -1;
  }

  function simpleEscapeSequence(c) {
      return c === 0x30 ? '\x00' : c === 0x61 ? '\x07' : c === 0x62 ? '\x08' : c === 0x74 ? '\x09' : c === 0x09 ? '\x09' : c === 0x6E ? '\x0A' : c === 0x76 ? '\x0B' : c === 0x66 ? '\x0C' : c === 0x72 ? '\x0D' : c === 0x65 ? '\x1B' : c === 0x20 ? ' ' : c === 0x22 ? '\x22' : c === 0x2F ? '/' : c === 0x5C ? '\x5C' : c === 0x4E ? '\x85' : c === 0x5F ? '\xA0' : c === 0x4C ? '\u2028' : c === 0x50 ? '\u2029' : '';
  }

  function charFromCodepoint(c) {
      if (c <= 0xFFFF) {
          return String.fromCharCode(c);
      }
      return String.fromCharCode((c - 0x010000 >> 10) + 0xD800, (c - 0x010000 & 0x03FF) + 0xDC00);
  }

  var simpleEscapeCheck = new Array(256);
  var simpleEscapeMap = new Array(256);
  for (var i = 0;i < 256; i++) {
      simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
      simpleEscapeMap[i] = simpleEscapeSequence(i);
  }
  function State(input, options) {
      this.input = input;
      this.filename = options['filename'] || null;
      this.schema = options['schema'] || default_full;
      this.onWarning = options['onWarning'] || null;
      this.legacy = options['legacy'] || false;
      this.json = options['json'] || false;
      this.listener = options['listener'] || null;
      this.implicitTypes = this.schema.compiledImplicit;
      this.typeMap = this.schema.compiledTypeMap;
      this.length = input.length;
      this.position = 0;
      this.line = 0;
      this.lineStart = 0;
      this.lineIndent = 0;
      this.documents = [];
  }

  function generateError(state, message) {
      return new exception(message, new mark(state.filename, state.input, state.position, state.line, state.position - state.lineStart));
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
          state.checkLineBreaks = minor < 2;
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
                  if (!(_character === 0x09 || 0x20 <= _character && _character <= 0x10FFFF)) {
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
          if (!state.json && !_hasOwnProperty$2.call(overridableKeys, keyNode) && _hasOwnProperty$2.call(_result, keyNode)) {
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
      if (ch === 0x0A) {
          state.position++;
      } else if (ch === 0x0D) {
          state.position++;
          if (state.input.charCodeAt(state.position) === 0x0A) {
              state.position++;
          }
      } else {
          throwError(state, 'a line break is expected');
      }
      state.line += 1;
      state.lineStart = state.position;
  }

  function skipSeparationSpace(state, allowComments, checkIndent) {
      var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
      while (ch !== 0) {
          while (is_WHITE_SPACE(ch)) {
              ch = state.input.charCodeAt(++state.position);
          }
          if (allowComments && ch === 0x23) {
              do {
                  ch = state.input.charCodeAt(++state.position);
              } while (ch !== 0x0A && ch !== 0x0D && ch !== 0);
          }
          if (is_EOL(ch)) {
              readLineBreak(state);
              ch = state.input.charCodeAt(state.position);
              lineBreaks++;
              state.lineIndent = 0;
              while (ch === 0x20) {
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
      var _position = state.position, ch;
      ch = state.input.charCodeAt(_position);
      if ((ch === 0x2D || ch === 0x2E) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
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
      var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
      ch = state.input.charCodeAt(state.position);
      if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 0x23 || ch === 0x26 || ch === 0x2A || ch === 0x21 || ch === 0x7C || ch === 0x3E || ch === 0x27 || ch === 0x22 || ch === 0x25 || ch === 0x40 || ch === 0x60) {
          return false;
      }
      if (ch === 0x3F || ch === 0x2D) {
          following = state.input.charCodeAt(state.position + 1);
          if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
              return false;
          }
      }
      state.kind = 'scalar';
      state.result = '';
      captureStart = (captureEnd = state.position);
      hasPendingContent = false;
      while (ch !== 0) {
          if (ch === 0x3A) {
              following = state.input.charCodeAt(state.position + 1);
              if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
                  break;
              }
          } else if (ch === 0x23) {
              preceding = state.input.charCodeAt(state.position - 1);
              if (is_WS_OR_EOL(preceding)) {
                  break;
              }
          } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
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
              captureStart = (captureEnd = state.position);
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
      var ch, captureStart, captureEnd;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 0x27) {
          return false;
      }
      state.kind = 'scalar';
      state.result = '';
      state.position++;
      captureStart = (captureEnd = state.position);
      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
          if (ch === 0x27) {
              captureSegment(state, captureStart, state.position, true);
              ch = state.input.charCodeAt(++state.position);
              if (ch === 0x27) {
                  captureStart = state.position;
                  state.position++;
                  captureEnd = state.position;
              } else {
                  return true;
              }
          } else if (is_EOL(ch)) {
              captureSegment(state, captureStart, captureEnd, true);
              writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
              captureStart = (captureEnd = state.position);
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
      var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 0x22) {
          return false;
      }
      state.kind = 'scalar';
      state.result = '';
      state.position++;
      captureStart = (captureEnd = state.position);
      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
          if (ch === 0x22) {
              captureSegment(state, captureStart, state.position, true);
              state.position++;
              return true;
          } else if (ch === 0x5C) {
              captureSegment(state, captureStart, state.position, true);
              ch = state.input.charCodeAt(++state.position);
              if (is_EOL(ch)) {
                  skipSeparationSpace(state, false, nodeIndent);
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
              captureStart = (captureEnd = state.position);
          } else if (is_EOL(ch)) {
              captureSegment(state, captureStart, captureEnd, true);
              writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
              captureStart = (captureEnd = state.position);
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
      var readNext = true, _line, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = {}, keyNode, keyTag, valueNode, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch === 0x5B) {
          terminator = 0x5D;
          isMapping = false;
          _result = [];
      } else if (ch === 0x7B) {
          terminator = 0x7D;
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
          keyTag = (keyNode = (valueNode = null));
          isPair = (isExplicitPair = false);
          if (ch === 0x3F) {
              following = state.input.charCodeAt(state.position + 1);
              if (is_WS_OR_EOL(following)) {
                  isPair = (isExplicitPair = true);
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
          if ((isExplicitPair || state.line === _line) && ch === 0x3A) {
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
          if (ch === 0x2C) {
              readNext = true;
              ch = state.input.charCodeAt(++state.position);
          } else {
              readNext = false;
          }
      }
      throwError(state, 'unexpected end of the stream within a flow collection');
  }

  function readBlockScalar(state, nodeIndent) {
      var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch === 0x7C) {
          folding = false;
      } else if (ch === 0x3E) {
          folding = true;
      } else {
          return false;
      }
      state.kind = 'scalar';
      state.result = '';
      while (ch !== 0) {
          ch = state.input.charCodeAt(++state.position);
          if (ch === 0x2B || ch === 0x2D) {
              if (CHOMPING_CLIP === chomping) {
                  chomping = ch === 0x2B ? CHOMPING_KEEP : CHOMPING_STRIP;
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
          do {
              ch = state.input.charCodeAt(++state.position);
          } while (is_WHITE_SPACE(ch));
          if (ch === 0x23) {
              do {
                  ch = state.input.charCodeAt(++state.position);
              } while (!is_EOL(ch) && ch !== 0);
          }
      }
      while (ch !== 0) {
          readLineBreak(state);
          state.lineIndent = 0;
          ch = state.input.charCodeAt(state.position);
          while ((!detectedIndent || state.lineIndent < textIndent) && ch === 0x20) {
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
          if (state.lineIndent < textIndent) {
              if (chomping === CHOMPING_KEEP) {
                  state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
              } else if (chomping === CHOMPING_CLIP) {
                  if (didReadContent) {
                      state.result += '\n';
                  }
              }
              break;
          }
          if (folding) {
              if (is_WHITE_SPACE(ch)) {
                  atMoreIndented = true;
                  state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
              } else if (atMoreIndented) {
                  atMoreIndented = false;
                  state.result += common.repeat('\n', emptyLines + 1);
              } else if (emptyLines === 0) {
                  if (didReadContent) {
                      state.result += ' ';
                  }
              } else {
                  state.result += common.repeat('\n', emptyLines);
              }
          } else {
              state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
          }
          didReadContent = true;
          detectedIndent = true;
          emptyLines = 0;
          captureStart = state.position;
          while (!is_EOL(ch) && ch !== 0) {
              ch = state.input.charCodeAt(++state.position);
          }
          captureSegment(state, captureStart, state.position, false);
      }
      return true;
  }

  function readBlockSequence(state, nodeIndent) {
      var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
      if (state.anchor !== null) {
          state.anchorMap[state.anchor] = _result;
      }
      ch = state.input.charCodeAt(state.position);
      while (ch !== 0) {
          if (ch !== 0x2D) {
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
          if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
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
      var following, allowCompact, _line, _pos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = {}, keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
      if (state.anchor !== null) {
          state.anchorMap[state.anchor] = _result;
      }
      ch = state.input.charCodeAt(state.position);
      while (ch !== 0) {
          following = state.input.charCodeAt(state.position + 1);
          _line = state.line;
          _pos = state.position;
          if ((ch === 0x3F || ch === 0x3A) && is_WS_OR_EOL(following)) {
              if (ch === 0x3F) {
                  if (atExplicitKey) {
                      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
                      keyTag = (keyNode = (valueNode = null));
                  }
                  detected = true;
                  atExplicitKey = true;
                  allowCompact = true;
              } else if (atExplicitKey) {
                  atExplicitKey = false;
                  allowCompact = true;
              } else {
                  throwError(state, 'incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line');
              }
              state.position += 1;
              ch = following;
          } else if (composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
              if (state.line === _line) {
                  ch = state.input.charCodeAt(state.position);
                  while (is_WHITE_SPACE(ch)) {
                      ch = state.input.charCodeAt(++state.position);
                  }
                  if (ch === 0x3A) {
                      ch = state.input.charCodeAt(++state.position);
                      if (!is_WS_OR_EOL(ch)) {
                          throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');
                      }
                      if (atExplicitKey) {
                          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
                          keyTag = (keyNode = (valueNode = null));
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
                      return true;
                  }
              } else if (detected) {
                  throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');
              } else {
                  state.tag = _tag;
                  state.anchor = _anchor;
                  return true;
              }
          } else {
              break;
          }
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
                  keyTag = (keyNode = (valueNode = null));
              }
              skipSeparationSpace(state, true, -1);
              ch = state.input.charCodeAt(state.position);
          }
          if (state.lineIndent > nodeIndent && ch !== 0) {
              throwError(state, 'bad indentation of a mapping entry');
          } else if (state.lineIndent < nodeIndent) {
              break;
          }
      }
      if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
      }
      if (detected) {
          state.tag = _tag;
          state.anchor = _anchor;
          state.kind = 'mapping';
          state.result = _result;
      }
      return detected;
  }

  function readTagProperty(state) {
      var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 0x21) 
          { return false; }
      if (state.tag !== null) {
          throwError(state, 'duplication of a tag property');
      }
      ch = state.input.charCodeAt(++state.position);
      if (ch === 0x3C) {
          isVerbatim = true;
          ch = state.input.charCodeAt(++state.position);
      } else if (ch === 0x21) {
          isNamed = true;
          tagHandle = '!!';
          ch = state.input.charCodeAt(++state.position);
      } else {
          tagHandle = '!';
      }
      _position = state.position;
      if (isVerbatim) {
          do {
              ch = state.input.charCodeAt(++state.position);
          } while (ch !== 0 && ch !== 0x3E);
          if (state.position < state.length) {
              tagName = state.input.slice(_position, state.position);
              ch = state.input.charCodeAt(++state.position);
          } else {
              throwError(state, 'unexpected end of the stream within a verbatim tag');
          }
      } else {
          while (ch !== 0 && !is_WS_OR_EOL(ch)) {
              if (ch === 0x21) {
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
      var _position, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 0x26) 
          { return false; }
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
      var _position, alias, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 0x2A) 
          { return false; }
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
      var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, type, flowIndent, blockIndent;
      if (state.listener !== null) {
          state.listener('open', state);
      }
      state.tag = null;
      state.anchor = null;
      state.kind = null;
      state.result = null;
      allowBlockStyles = (allowBlockScalars = (allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext));
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
              if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
                  hasContent = true;
              } else {
                  if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
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
              hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
          }
      }
      if (state.tag !== null && state.tag !== '!') {
          if (state.tag === '?') {
              for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
                  type = state.implicitTypes[typeIndex];
                  if (type.resolve(state.result)) {
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
              if (!type.resolve(state.result)) {
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
      return state.tag !== null || state.anchor !== null || hasContent;
  }

  function readDocument(state) {
      var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
      state.version = null;
      state.checkLineBreaks = state.legacy;
      state.tagMap = {};
      state.anchorMap = {};
      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
          skipSeparationSpace(state, true, -1);
          ch = state.input.charCodeAt(state.position);
          if (state.lineIndent > 0 || ch !== 0x25) {
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
              if (ch === 0x23) {
                  do {
                      ch = state.input.charCodeAt(++state.position);
                  } while (ch !== 0 && !is_EOL(ch));
                  break;
              }
              if (is_EOL(ch)) 
                  { break; }
              _position = state.position;
              while (ch !== 0 && !is_WS_OR_EOL(ch)) {
                  ch = state.input.charCodeAt(++state.position);
              }
              directiveArgs.push(state.input.slice(_position, state.position));
          }
          if (ch !== 0) 
              { readLineBreak(state); }
          if (_hasOwnProperty$2.call(directiveHandlers, directiveName)) {
              directiveHandlers[directiveName](state, directiveName, directiveArgs);
          } else {
              throwWarning(state, 'unknown document directive "' + directiveName + '"');
          }
      }
      skipSeparationSpace(state, true, -1);
      if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 0x2D && state.input.charCodeAt(state.position + 1) === 0x2D && state.input.charCodeAt(state.position + 2) === 0x2D) {
          state.position += 3;
          skipSeparationSpace(state, true, -1);
      } else if (hasDirectives) {
          throwError(state, 'directives end mark is expected');
      }
      composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
      skipSeparationSpace(state, true, -1);
      if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
          throwWarning(state, 'non-ASCII line breaks are interpreted as content');
      }
      state.documents.push(state.result);
      if (state.position === state.lineStart && testDocumentSeparator(state)) {
          if (state.input.charCodeAt(state.position) === 0x2E) {
              state.position += 3;
              skipSeparationSpace(state, true, -1);
          }
          return;
      }
      if (state.position < state.length - 1) {
          throwError(state, 'end of the stream or a document separator is expected');
      } else {
          return;
      }
  }

  function loadDocuments(input, options) {
      input = String(input);
      options = options || {};
      if (input.length !== 0) {
          if (input.charCodeAt(input.length - 1) !== 0x0A && input.charCodeAt(input.length - 1) !== 0x0D) {
              input += '\n';
          }
          if (input.charCodeAt(0) === 0xFEFF) {
              input = input.slice(1);
          }
      }
      var state = new State(input, options);
      state.input += '\0';
      while (state.input.charCodeAt(state.position) === 0x20) {
          state.lineIndent += 1;
          state.position += 1;
      }
      while (state.position < state.length - 1) {
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
          return undefined;
      } else if (documents.length === 1) {
          return documents[0];
      }
      throw new exception('expected a single document in the stream, but found more');
  }

  function safeLoadAll(input, output, options) {
      if (typeof output === 'function') {
          loadAll(input, output, common.extend({
              schema: default_safe
          }, options));
      } else {
          return loadAll(input, common.extend({
              schema: default_safe
          }, options));
      }
  }

  function safeLoad(input, options) {
      return load(input, common.extend({
          schema: default_safe
      }, options));
  }

  var loadAll_1 = loadAll;
  var load_1 = load;
  var safeLoadAll_1 = safeLoadAll;
  var safeLoad_1 = safeLoad;




  var loader = {
  	loadAll: loadAll_1,
  	load: load_1,
  	safeLoadAll: safeLoadAll_1,
  	safeLoad: safeLoad_1
  };

  var _toString$2 = Object.prototype.toString;
  var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
  var CHAR_TAB = 0x09;
  var CHAR_LINE_FEED = 0x0A;
  var CHAR_SPACE = 0x20;
  var CHAR_EXCLAMATION = 0x21;
  var CHAR_DOUBLE_QUOTE = 0x22;
  var CHAR_SHARP = 0x23;
  var CHAR_PERCENT = 0x25;
  var CHAR_AMPERSAND = 0x26;
  var CHAR_SINGLE_QUOTE = 0x27;
  var CHAR_ASTERISK = 0x2A;
  var CHAR_COMMA = 0x2C;
  var CHAR_MINUS = 0x2D;
  var CHAR_COLON = 0x3A;
  var CHAR_GREATER_THAN = 0x3E;
  var CHAR_QUESTION = 0x3F;
  var CHAR_COMMERCIAL_AT = 0x40;
  var CHAR_LEFT_SQUARE_BRACKET = 0x5B;
  var CHAR_RIGHT_SQUARE_BRACKET = 0x5D;
  var CHAR_GRAVE_ACCENT = 0x60;
  var CHAR_LEFT_CURLY_BRACKET = 0x7B;
  var CHAR_VERTICAL_LINE = 0x7C;
  var CHAR_RIGHT_CURLY_BRACKET = 0x7D;
  var ESCAPE_SEQUENCES = {};
  ESCAPE_SEQUENCES[0x00] = '\\0';
  ESCAPE_SEQUENCES[0x07] = '\\a';
  ESCAPE_SEQUENCES[0x08] = '\\b';
  ESCAPE_SEQUENCES[0x09] = '\\t';
  ESCAPE_SEQUENCES[0x0A] = '\\n';
  ESCAPE_SEQUENCES[0x0B] = '\\v';
  ESCAPE_SEQUENCES[0x0C] = '\\f';
  ESCAPE_SEQUENCES[0x0D] = '\\r';
  ESCAPE_SEQUENCES[0x1B] = '\\e';
  ESCAPE_SEQUENCES[0x22] = '\\"';
  ESCAPE_SEQUENCES[0x5C] = '\\\\';
  ESCAPE_SEQUENCES[0x85] = '\\N';
  ESCAPE_SEQUENCES[0xA0] = '\\_';
  ESCAPE_SEQUENCES[0x2028] = '\\L';
  ESCAPE_SEQUENCES[0x2029] = '\\P';
  var DEPRECATED_BOOLEANS_SYNTAX = ['y','Y','yes','Yes','YES','on','On','ON','n','N',
      'no','No','NO','off','Off','OFF'];
  function compileStyleMap(schema, map) {
      var result, keys, index, length, tag, style, type;
      if (map === null) 
          { return {}; }
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
          throw new exception('code point within a string may not be greater than 0xFFFFFFFF');
      }
      return '\\' + handle + common.repeat('0', length - string.length) + string;
  }

  function State$1(options) {
      this.schema = options['schema'] || default_full;
      this.indent = Math.max(1, options['indent'] || 2);
      this.noArrayIndent = options['noArrayIndent'] || false;
      this.skipInvalid = options['skipInvalid'] || false;
      this.flowLevel = common.isNothing(options['flowLevel']) ? -1 : options['flowLevel'];
      this.styleMap = compileStyleMap(this.schema, options['styles'] || null);
      this.sortKeys = options['sortKeys'] || false;
      this.lineWidth = options['lineWidth'] || 80;
      this.noRefs = options['noRefs'] || false;
      this.noCompatMode = options['noCompatMode'] || false;
      this.condenseFlow = options['condenseFlow'] || false;
      this.implicitTypes = this.schema.compiledImplicit;
      this.explicitTypes = this.schema.compiledExplicit;
      this.tag = null;
      this.result = '';
      this.duplicates = [];
      this.usedDuplicates = null;
  }

  function indentString(string, spaces) {
      var ind = common.repeat(' ', spaces), position = 0, next = -1, result = '', line, length = string.length;
      while (position < length) {
          next = string.indexOf('\n', position);
          if (next === -1) {
              line = string.slice(position);
              position = length;
          } else {
              line = string.slice(position, next + 1);
              position = next + 1;
          }
          if (line.length && line !== '\n') 
              { result += ind; }
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

  function isWhitespace(c) {
      return c === CHAR_SPACE || c === CHAR_TAB;
  }

  function isPrintable(c) {
      return 0x00020 <= c && c <= 0x00007E || 0x000A1 <= c && c <= 0x00D7FF && c !== 0x2028 && c !== 0x2029 || 0x0E000 <= c && c <= 0x00FFFD && c !== 0xFEFF || 0x10000 <= c && c <= 0x10FFFF;
  }

  function isPlainSafe(c) {
      return isPrintable(c) && c !== 0xFEFF && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_COLON && c !== CHAR_SHARP;
  }

  function isPlainSafeFirst(c) {
      return isPrintable(c) && c !== 0xFEFF && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
  }

  function needIndentIndicator(string) {
      var leadingSpaceRe = /^\n* /;
      return leadingSpaceRe.test(string);
  }

  var STYLE_PLAIN = 1, STYLE_SINGLE = 2, STYLE_LITERAL = 3, STYLE_FOLDED = 4, STYLE_DOUBLE = 5;
  function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType) {
      var i;
      var char;
      var hasLineBreak = false;
      var hasFoldableLine = false;
      var shouldTrackWidth = lineWidth !== -1;
      var previousLineBreak = -1;
      var plain = isPlainSafeFirst(string.charCodeAt(0)) && !isWhitespace(string.charCodeAt(string.length - 1));
      if (singleLineOnly) {
          for (i = 0; i < string.length; i++) {
              char = string.charCodeAt(i);
              if (!isPrintable(char)) {
                  return STYLE_DOUBLE;
              }
              plain = plain && isPlainSafe(char);
          }
      } else {
          for (i = 0; i < string.length; i++) {
              char = string.charCodeAt(i);
              if (char === CHAR_LINE_FEED) {
                  hasLineBreak = true;
                  if (shouldTrackWidth) {
                      hasFoldableLine = hasFoldableLine || i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== ' ';
                      previousLineBreak = i;
                  }
              } else if (!isPrintable(char)) {
                  return STYLE_DOUBLE;
              }
              plain = plain && isPlainSafe(char);
          }
          hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== ' ');
      }
      if (!hasLineBreak && !hasFoldableLine) {
          return plain && !testAmbiguousType(string) ? STYLE_PLAIN : STYLE_SINGLE;
      }
      if (indentPerLevel > 9 && needIndentIndicator(string)) {
          return STYLE_DOUBLE;
      }
      return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }

  function writeScalar(state, string, level, iskey) {
      state.dump = (function () {
          if (string.length === 0) {
              return "''";
          }
          if (!state.noCompatMode && DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1) {
              return "'" + string + "'";
          }
          var indent = state.indent * Math.max(1, level);
          var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
          var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
          function testAmbiguity(string) {
              return testImplicitResolving(state, string);
          }
          
          switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth, testAmbiguity)) {
              case STYLE_PLAIN:
                  return string;
              case STYLE_SINGLE:
                  return "'" + string.replace(/'/g, "''") + "'";
              case STYLE_LITERAL:
                  return '|' + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
              case STYLE_FOLDED:
                  return '>' + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
              case STYLE_DOUBLE:
                  return '"' + escapeString(string) + '"';
              default:
                  throw new exception('impossible error: invalid scalar style');
          }
      })();
  }

  function blockHeader(string, indentPerLevel) {
      var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : '';
      var clip = string[string.length - 1] === '\n';
      var keep = clip && (string[string.length - 2] === '\n' || string === '\n');
      var chomp = keep ? '+' : clip ? '' : '-';
      return indentIndicator + chomp + '\n';
  }

  function dropEndingNewline(string) {
      return string[string.length - 1] === '\n' ? string.slice(0, -1) : string;
  }

  function foldString(string, width) {
      var lineRe = /(\n+)([^\n]*)/g;
      var result = (function () {
          var nextLF = string.indexOf('\n');
          nextLF = nextLF !== -1 ? nextLF : string.length;
          lineRe.lastIndex = nextLF;
          return foldLine(string.slice(0, nextLF), width);
      })();
      var prevMoreIndented = string[0] === '\n' || string[0] === ' ';
      var moreIndented;
      var match;
      while (match = lineRe.exec(string)) {
          var prefix = match[1], line = match[2];
          moreIndented = line[0] === ' ';
          result += prefix + (!prevMoreIndented && !moreIndented && line !== '' ? '\n' : '') + foldLine(line, width);
          prevMoreIndented = moreIndented;
      }
      return result;
  }

  function foldLine(line, width) {
      if (line === '' || line[0] === ' ') 
          { return line; }
      var breakRe = / [^ ]/g;
      var match;
      var start = 0, end, curr = 0, next = 0;
      var result = '';
      while (match = breakRe.exec(line)) {
          next = match.index;
          if (next - start > width) {
              end = curr > start ? curr : next;
              result += '\n' + line.slice(start, end);
              start = end + 1;
          }
          curr = next;
      }
      result += '\n';
      if (line.length - start > width && curr > start) {
          result += line.slice(start, curr) + '\n' + line.slice(curr + 1);
      } else {
          result += line.slice(start);
      }
      return result.slice(1);
  }

  function escapeString(string) {
      var result = '';
      var char, nextChar;
      var escapeSeq;
      for (var i = 0;i < string.length; i++) {
          char = string.charCodeAt(i);
          if (char >= 0xD800 && char <= 0xDBFF) {
              nextChar = string.charCodeAt(i + 1);
              if (nextChar >= 0xDC00 && nextChar <= 0xDFFF) {
                  result += encodeHex((char - 0xD800) * 0x400 + nextChar - 0xDC00 + 0x10000);
                  i++;
                  continue;
              }
          }
          escapeSeq = ESCAPE_SEQUENCES[char];
          result += !escapeSeq && isPrintable(char) ? string[i] : escapeSeq || encodeHex(char);
      }
      return result;
  }

  function writeFlowSequence(state, level, object) {
      var _result = '', _tag = state.tag, index, length;
      for (index = 0, length = object.length; index < length; index += 1) {
          if (writeNode(state, level, object[index], false, false)) {
              if (index !== 0) 
                  { _result += ',' + (!state.condenseFlow ? ' ' : ''); }
              _result += state.dump;
          }
      }
      state.tag = _tag;
      state.dump = '[' + _result + ']';
  }

  function writeBlockSequence(state, level, object, compact) {
      var _result = '', _tag = state.tag, index, length;
      for (index = 0, length = object.length; index < length; index += 1) {
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
      state.dump = _result || '[]';
  }

  function writeFlowMapping(state, level, object) {
      var _result = '', _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
      for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          pairBuffer = state.condenseFlow ? '"' : '';
          if (index !== 0) 
              { pairBuffer += ', '; }
          objectKey = objectKeyList[index];
          objectValue = object[objectKey];
          if (!writeNode(state, level, objectKey, false, false)) {
              continue;
          }
          if (state.dump.length > 1024) 
              { pairBuffer += '? '; }
          pairBuffer += state.dump + (state.condenseFlow ? '"' : '') + ':' + (state.condenseFlow ? '' : ' ');
          if (!writeNode(state, level, objectValue, false, false)) {
              continue;
          }
          pairBuffer += state.dump;
          _result += pairBuffer;
      }
      state.tag = _tag;
      state.dump = '{' + _result + '}';
  }

  function writeBlockMapping(state, level, object, compact) {
      var _result = '', _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
      if (state.sortKeys === true) {
          objectKeyList.sort();
      } else if (typeof state.sortKeys === 'function') {
          objectKeyList.sort(state.sortKeys);
      } else if (state.sortKeys) {
          throw new exception('sortKeys must be a boolean or a function');
      }
      for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          pairBuffer = '';
          if (!compact || index !== 0) {
              pairBuffer += generateNextLine(state, level);
          }
          objectKey = objectKeyList[index];
          objectValue = object[objectKey];
          if (!writeNode(state, level + 1, objectKey, true, true, true)) {
              continue;
          }
          explicitPair = state.tag !== null && state.tag !== '?' || state.dump && state.dump.length > 1024;
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
              continue;
          }
          if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
              pairBuffer += ':';
          } else {
              pairBuffer += ': ';
          }
          pairBuffer += state.dump;
          _result += pairBuffer;
      }
      state.tag = _tag;
      state.dump = _result || '{}';
  }

  function detectType(state, object, explicit) {
      var _result, typeList, index, length, type, style;
      typeList = explicit ? state.explicitTypes : state.implicitTypes;
      for (index = 0, length = typeList.length; index < length; index += 1) {
          type = typeList[index];
          if ((type.instanceOf || type.predicate) && (!type.instanceOf || typeof object === 'object' && object instanceof type.instanceOf) && (!type.predicate || type.predicate(object))) {
              state.tag = explicit ? type.tag : '?';
              if (type.represent) {
                  style = state.styleMap[type.tag] || type.defaultStyle;
                  if (_toString$2.call(type.represent) === '[object Function]') {
                      _result = type.represent(object, style);
                  } else if (_hasOwnProperty$3.call(type.represent, style)) {
                      _result = type.represent[style](object, style);
                  } else {
                      throw new exception('!<' + type.tag + '> tag resolver accepts not "' + style + '" style');
                  }
                  state.dump = _result;
              }
              return true;
          }
      }
      return false;
  }

  function writeNode(state, level, object, block, compact, iskey) {
      state.tag = null;
      state.dump = object;
      if (!detectType(state, object, false)) {
          detectType(state, object, true);
      }
      var type = _toString$2.call(state.dump);
      if (block) {
          block = state.flowLevel < 0 || state.flowLevel > level;
      }
      var objectOrArray = type === '[object Object]' || type === '[object Array]', duplicateIndex, duplicate;
      if (objectOrArray) {
          duplicateIndex = state.duplicates.indexOf(object);
          duplicate = duplicateIndex !== -1;
      }
      if (state.tag !== null && state.tag !== '?' || duplicate || state.indent !== 2 && level > 0) {
          compact = false;
      }
      if (duplicate && state.usedDuplicates[duplicateIndex]) {
          state.dump = '*ref_' + duplicateIndex;
      } else {
          if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
              state.usedDuplicates[duplicateIndex] = true;
          }
          if (type === '[object Object]') {
              if (block && Object.keys(state.dump).length !== 0) {
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
              var arrayLevel = state.noArrayIndent && level > 0 ? level - 1 : level;
              if (block && state.dump.length !== 0) {
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
              if (state.skipInvalid) 
                  { return false; }
              throw new exception('unacceptable kind of an object to dump ' + type);
          }
          if (state.tag !== null && state.tag !== '?') {
              state.dump = '!<' + state.tag + '> ' + state.dump;
          }
      }
      return true;
  }

  function getDuplicateReferences(object, state) {
      var objects = [], duplicatesIndexes = [], index, length;
      inspectNode(object, objects, duplicatesIndexes);
      for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
          state.duplicates.push(objects[duplicatesIndexes[index]]);
      }
      state.usedDuplicates = new Array(length);
  }

  function inspectNode(object, objects, duplicatesIndexes) {
      var objectKeyList, index, length;
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
      if (!state.noRefs) 
          { getDuplicateReferences(input, state); }
      if (writeNode(state, 0, input, true, true)) 
          { return state.dump + '\n'; }
      return '';
  }

  function safeDump(input, options) {
      return dump(input, common.extend({
          schema: default_safe
      }, options));
  }

  var dump_1 = dump;
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

  var Type$1 = type;
  var Schema$1 = schema;
  var FAILSAFE_SCHEMA = failsafe;
  var JSON_SCHEMA = json;
  var CORE_SCHEMA = core;
  var DEFAULT_SAFE_SCHEMA = default_safe;
  var DEFAULT_FULL_SCHEMA = default_full;
  var load$1 = loader.load;
  var loadAll$1 = loader.loadAll;
  var safeLoad$1 = loader.safeLoad;
  var safeLoadAll$1 = loader.safeLoadAll;
  var dump$1 = dumper.dump;
  var safeDump$1 = dumper.safeDump;
  var YAMLException$1 = exception;
  var MINIMAL_SCHEMA = failsafe;
  var SAFE_SCHEMA = default_safe;
  var DEFAULT_SCHEMA = default_full;
  var scan = deprecated('scan');
  var parse = deprecated('parse');
  var compose = deprecated('compose');
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

  function safeDump$2(data) {
      data = JSON.parse(JSON.stringify(data));
      return jsYaml$1.safeDump(data);
  }

  function safeLoad$2(text) {
      return jsYaml$1.safeLoad(text);
  }

  var dictRemove = function (dict, removes) {
      var copy = {};
      Object.assign(copy, dict);
      removes.forEach(function (remove) {
          if (copy.hasOwnProperty(remove)) 
              { delete copy[remove]; }
      });
      return copy;
  };

  function pinSplitOwner(fullName) {
      if ( fullName === void 0 ) fullName = '';

      var parts = fullName.split('/');
      var name = parts[0];
      parts.pop();
      var owner = parts.join('/');
      return {
          name: name,
          owner: owner
      };
  }

  function pinContentName(fullName) {
      return typeof fullName === 'string' ? pinSplitOwner(fullName).name : fullName;
  }

  function pinResultsFromRows(entries) {
      var rows = entries.map(function (e) {
          var row = {
              name: e.name || basename(e.path),
              description: e.description || '',
              type: e.type || 'files'
          };
          row['metadata'] = dictRemove(e, ['name','description','type']);
          return row;
      });
      return dataFrame(rows, {
          name: 'character',
          description: 'character',
          type: 'character'
      });
  }

  function pinResultsExtractColumn(df, column) {
      if (df && df.metadata) {
          df[column] = df.metadata[column];
      }
      return df;
  }

  function pinResultsMerge(r1, r2) {
      var result = [].concat(r1).concat(r2);
      result.columns = {};
      Object.assign(result.columns, r1.columns);
      Object.assign(result.columns, r2.columns);
      return result;
  }

  var tryCatch = function (expr, error) { return new Promise(function ($return, $error) {
      var $Try_1_Catch = function (err) {
          try {
              return $return(error(err));
          } catch ($boundEx) {
              return $error($boundEx);
          }
      };
      try {
          return new Promise(function ($return, $error) {
              if (!(!expr.then)) {
                  return expr().then($return, $error);
              }
              return $return(expr());
          }).then($return, $Try_1_Catch);
      } catch (err) {
          $Try_1_Catch(err);
      }
  }); };
  var tryCatchNull = function (expr, error) { return tryCatch(expr, function () { return null; }); };

  function pinRegistryConfig(board) {
      return path(boardLocalStorage(board), 'data.txt');
  }

  function pinRegistryLoadEntries(board) {
      return new Promise(function ($return, $error) {
          var lock;
          lock = pinRegistryLock(board);
          return onExit(function () { return pinRegistryUnlock(lock); }, function () {
              var entriesPath = pinRegistryConfig(board);
              if (!fileExists(entriesPath)) {
                  return [];
              } else {
                  var yamlText = readLines(entriesPath).join('\n');
                  var loadedYaml = safeLoad$2(yamlText);
                  return loadedYaml;
              }
          }).then($return, $error);
      });
  }

  function pinRegistrySaveEntries(entries, board) {
      return new Promise(function ($return, $error) {
          var lock;
          lock = pinRegistryLock(board);
          return onExit(function () { return pinRegistryUnlock(lock); }, function () {
              var yamlText = safeDump$2(entries).split('\n');
              writeLines(pinRegistryConfig(board), yamlText);
          }).then($return, $error);
      });
  }

  function pinStoragePath(board, name) {
      var path$1 = path(boardLocalStorage(board), name);
      if (!dir.exists(path$1)) {
          dir.create(path$1, {
              recursive: true
          });
      }
      return path$1;
  }

  function pinRegistryUpdate(name, board, params) {
      if ( params === void 0 ) params = {};

      return new Promise(function ($return, $error) {
          var lock;
          lock = pinRegistryLock(board);
          return onExit(function () { return pinRegistryUnlock(lock); }, function () { return new Promise(function ($return, $error) {
              var entries, path, names, index;
              return pinRegistryLoadEntries(board).then(function ($await_4) {
                  try {
                      entries = $await_4;
                      name = pinRegistryQualifyName(name, entries);
                      path = pinStoragePath(board, name);
                      if (entries === null) 
                          { entries = []; }
                      names = entries.map(function (e) { return e.name; });
                      index = 0;
                      if (names.includes(name)) {
                          index = names.findIndex(function (e) { return e === name; });
                      } else {
                          index = entries.length;
                          entries[index] = {};
                      }
                      entries[index]['name'] = name;
                      for (var param in params) {
                          if (Array.isArray(params[param]) && !params[param].length || typeof params[param] === 'undefined') {
                              delete entries[index][param];
                          } else {
                              entries[index][param] = params[param];
                          }
                      }
                      return pinRegistrySaveEntries(entries, board).then(function ($await_5) {
                          try {
                              return $return(path);
                          } catch ($boundEx) {
                              return $error($boundEx);
                          }
                      }, $error);
                  } catch ($boundEx) {
                      return $error($boundEx);
                  }
              }, $error);
          }); }).then($return, $error);
      });
  }

  function pinRegistryFind(text, board) {
      return new Promise(function ($return, $error) {
          var lock;
          lock = pinRegistryLock(board);
          return onExit(function () { return pinRegistryUnlock(lock); }, function () { return new Promise(function ($return, $error) {
              var entries, results;
              return pinRegistryLoadEntries(board).then(function ($await_7) {
                  try {
                      entries = $await_7;
                      results = pinResultsFromRows(entries);
                      if (typeof text === 'string' && text.length > 0) {
                          results = results.filter(function (x) { return new RegExp(text, 'gi').test(x['name']); });
                      }
                      return $return(results);
                  } catch ($boundEx) {
                      return $error($boundEx);
                  }
              }, $error);
          }); }).then($return, $error);
      });
  }

  function pinRegistryRetrieve(name, board) {
      return new Promise(function ($return, $error) {
          var lock;
          lock = pinRegistryLock(board);
          return onExit(function () { return pinRegistryUnlock(lock); }, function () { return new Promise(function ($return, $error) {
              var entries, names;
              return pinRegistryLoadEntries(board).then(function ($await_9) {
                  try {
                      entries = $await_9;
                      name = pinRegistryQualifyName(name, entries);
                      names = entries.map(function (e) { return e.name; });
                      if (!names.includes(name)) {
                          pinLog(("Pin not found, pins available in registry: " + (names.join(', '))));
                          return $error(new Error(("Pin '" + name + "' not found in '" + (board.name) + "' board.")));
                      }
                      return $return(entries.find(function (e) { return e.name === name; }));
                  } catch ($boundEx) {
                      return $error($boundEx);
                  }
              }, $error);
          }); }).then($return, $error);
      });
  }

  function pinRegistryRetrievePath(name, board) {
      return new Promise(function ($return, $error) {
          var entry;
          return pinRegistryRetrieve(name, board).then(function ($await_11) {
              try {
                  entry = $await_11;
                  return $return(entry['path']);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }, $error);
      });
  }

  function pinRegistryRetrieveMaybe(name, board) {
      return new Promise(function ($return, $error) {
          return tryCatchNull(function () { return new Promise(function ($return, $error) {
              return pinRegistryRetrieve(name, board).then(function ($await_12) {
                  try {
                      return $await_12.then($return, $error);
                  } catch ($boundEx) {
                      return $error($boundEx);
                  }
              }, $error);
          }); }).then($return, $error);
      });
  }

  function pinRegistryRemove(name, board, unlink) {
      if ( unlink === void 0 ) unlink = true;

      return new Promise(function ($return, $error) {
          var entries, remove, removePath;
          return pinRegistryLoadEntries(board).then(function ($await_15) {
              try {
                  entries = $await_15;
                  name = pinRegistryQualifyName(name, entries);
                  remove = entries.filter(function (x) { return x.name === name; });
                  if (remove.length > 0) 
                      { remove = remove[0]; }
                   else 
                      { return $return(); }
                  entries = entries.filter(function (x) { return x.name !== name; });
                  removePath = pinRegistryAbsolute(remove.path, board);
                  if (unlink) 
                      { dir.remove(removePath, {
                      recursive: true
                  }); }
                  return pinRegistrySaveEntries(entries, board).then($return, $error);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }, $error);
      });
  }

  function pinRegistryQualifyName(name, entries) {
      var names = entries.map(function (e) { return e.name; });
      var namePattern = '';
      if (new RegExp(/\//g).test(name)) {
          namePattern = "^" + name + "$";
      } else {
          namePattern = ".*/" + name + "$";
      }
      var nameCandidate = names.filter(function (e) { return new RegExp(namePattern, 'gi').test(e); });
      if (nameCandidate.length === 1) {
          name = nameCandidate[0];
      }
      return name;
  }

  function pinRegistryLock(board) {
      var lockFile$1 = pinRegistryConfig(board) + '.lock';
      return lockFile(lockFile$1, getOption('pins.lock.timeout', Infinity));
  }

  function pinRegistryUnlock(lock) {
      return unlockFile(lock);
  }

  function pinRegistryRelative(path, basePath) {
      path = normalizePath(path, {
          winslash: '/',
          mustWork: false
      });
      basePath = normalizePath(basePath, {
          winslash: '/',
          mustWork: false
      });
      if (path.indexOf(basePath) === 0) {
          path = path.substr(basePath.length + 1, path.length);
      }
      var relative = path.replace('^/', '');
      return relative;
  }

  function pinRegistryAbsolute(path$1, board) {
      var basePath = absolutePath(boardLocalStorage(board));
      if (path$1.indexOf(basePath) === 0) {
          return path$1;
      } else {
          return normalizePath(path(basePath, path$1), {
              mustWork: false
          });
      }
  }

  function pinResetCache(board, name) {
      return new Promise(function ($return, $error) {
          var sanitizedName, index;
          sanitizedName = name.replace(/^https?:\/\//g, '');
          return tryCatchNull(function () { return new Promise(function ($return, $error) {
              return pinRegistryRetrieve(sanitizedName, board).then(function ($await_17) {
                  try {
                      return $return($await_17 || null);
                  } catch ($boundEx) {
                      return $error($boundEx);
                  }
              }, $error);
          }); }).then((function ($await_18) {
              try {
                  index = $await_18;
                  if (!isNull(index)) {
                      index.cache = {};
                      return pinRegistryUpdate(sanitizedName, board, {
                          params: index
                      }).then((function ($await_19) {
                          try {
                              return $If_1.call(this);
                          } catch ($boundEx) {
                              return $error($boundEx);
                          }
                      }).bind(this), $error);
                  }
                  function $If_1() {
                      return $return();
                  }
                  
                  return $If_1.call(this);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }).bind(this), $error);
      });
  }

  var namesArr = function (l) {
      if (isNull(l)) 
          { return []; }
       else 
          { return Object.keys(l); }
  };
  var removeNulls = function (obj) {
      for (var prop in obj) {
          if (isNull(obj[prop])) {
              delete obj[prop];
          }
      }
  };

  var METHODS = {};
  var DEFAULT_CLASS_NAME = 'default';
  function initializeMethod(methodName, object) {
      var args = [], len = arguments.length - 2;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

      METHODS[methodName] = METHODS[methodName] || {};
      var className = (object && object.class ? object.class : object.constructor && object.constructor.name ? object.constructor.name : DEFAULT_CLASS_NAME).toLowerCase();
      if (dfIsDataFrame(object)) {
          className = 'dataframe';
      }
      if (typeof object['_content'] !== 'undefined') {
          object = object['_content'];
      }
      return {
          className: className,
          object: object
      };
  }

  var registerMethod = function (methodName, className, method) {
      METHODS[methodName] = METHODS[methodName] || {};
      METHODS[methodName][className] = method;
      return method;
  };
  function useMethodAsync(methodName, object) {
      var args = [], len = arguments.length - 2;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

      return new Promise(function ($return, $error) {
          var ref, ref$1;

          var init, className;
          init = initializeMethod.apply(void 0, [ methodName, object ].concat( args ));
          className = init.className;
          object = init.object;
          if (METHODS[methodName] && METHODS[methodName][className]) {
              var result;
              result = (ref = METHODS[methodName])[className].apply(ref, [ object ].concat( args ));
              if (result && result.then) {
                  return result.then($return, $error);
              }
              return $return(result);
          }
          if (METHODS[methodName] && METHODS[methodName]['default']) {
              return $return((ref$1 = METHODS[methodName])['default'].apply(ref$1, [ object ].concat( args )));
          }
          return $error(new Error(("no applicable method for '" + methodName + "' applied to an object of class '" + className + "'")));
      });
  }

  function useMethod(methodName, object) {
      var ref, ref$1;

      var args = [], len = arguments.length - 2;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];
      var init = initializeMethod.apply(void 0, [ methodName, object ].concat( args ));
      var className = init.className;
      object = init.object;
      if (METHODS[methodName] && METHODS[methodName][className]) {
          return (ref = METHODS[methodName])[className].apply(ref, [ object ].concat( args ));
      }
      if (METHODS[methodName] && METHODS[methodName]['default']) {
          return (ref$1 = METHODS[methodName])['default'].apply(ref$1, [ object ].concat( args ));
      }
      throw new Error(("no applicable method for '" + methodName + "' applied to an object of class '" + className + "'"));
  }

  function objectWithoutProperties (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  pinDebug({});
  function pin(x) {
      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

      return new Promise(function ($return, $error) {
          return useMethodAsync.apply(void 0, [ 'pin', x ].concat( args )).then(function ($await_12) {
              try {
                  return $return(maybeOne($await_12));
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }, $error);
      });
  }

  function pinGet(name, args) {
      return new Promise(function ($return, $error) {
          var assign, rest;

          var boardPinGetOrNull, result, manifest, resultFiles, pinSignature;
          var board, cache, extract, version, files, signature, opts;
          ((assign = args, board = assign.board, cache = assign.cache, extract = assign.extract, version = assign.version, files = assign.files, signature = assign.signature, rest = objectWithoutProperties( assign, ["board", "cache", "extract", "version", "files", "signature"] ), opts = rest));
          if (isNull(board)) {
              boardPinGetOrNull = (function () {
                  var opts = [], len = arguments.length;
                  while ( len-- ) opts[ len ] = arguments[ len ];

                  return new Promise(function ($return, $error) {
                  var $Try_1_Catch = function (err) {
                      try {
                          return $return(null);
                      } catch ($boundEx) {
                          return $error($boundEx);
                      }
                  };
                  try {
                      return boardPinGet.apply(void 0, opts).then($return, $Try_1_Catch);
                  } catch (err) {
                      $Try_1_Catch();
                  }
              });
              });
              return boardPinGetOrNull(boardGet$1(null), name, {
                  version: version
              }).then((function ($await_14) {
                  try {
                      result = $await_14;
                      if (isNull(result) && isNull(board)) {
                          var boardsList;
                          boardsList = boardList();
                          var $Loop_5_trampoline, $Loop_5_local;
                          function $Loop_5_step() {
                              var ref = $Loop_5_local();
                              var idx = ref[0];
                              idx++;
                              return $Loop_5.bind(this, idx);
                          }
                          
                          function $Loop_5(idx) {
                              $Loop_5_local = function () {
                                  return [idx];
                              };
                              if (idx < boardsList.length) {
                                  var boardName;
                                  boardName = boardList[idx];
                                  if (!cache) {
                                      return pinResetCache(boardName, name).then((function ($await_15) {
                                          try {
                                              return $If_7.call(this);
                                          } catch ($boundEx) {
                                              return $error($boundEx);
                                          }
                                      }).bind(this), $error);
                                  }
                                  function $If_7() {
                                      return boardPinGetOrNull(boardGet$1(boardName), name, {
                                          extract: extract,
                                          version: version
                                      }).then(function ($await_16) {
                                          try {
                                              result = $await_16;
                                              if (!isNull(result)) {
                                                  pinLog('Found pin ' + name + ' in board ' + boardName);
                                                  return [1];
                                              }
                                              return $Loop_5_step;
                                          } catch ($boundEx) {
                                              return $error($boundEx);
                                          }
                                      }, $error);
                                  }
                                  
                                  return $If_7.call(this);
                              } else 
                                  { return [1]; }
                          }
                          
                          return ($Loop_5_trampoline = (function (q) {
                              while (q) {
                                  if (q.then) 
                                      { return void q.then($Loop_5_trampoline, $error); }
                                  try {
                                      if (q.pop) 
                                          { if (q.length) 
                                          { return q.pop() ? $Loop_5_exit.call(this) : q; }
                                       else 
                                          { q = $Loop_5_step; } }
                                       else 
                                          { q = q.call(this); }
                                  } catch (_exception) {
                                      return $error(_exception);
                                  }
                              }
                          }).bind(this))($Loop_5.bind(this, 0));
                          function $Loop_5_exit() {
                              return $If_4.call(this);
                          }
                          
                      }
                      function $If_4() {
                          if (isNull(result)) 
                              { return $error(new Error("Failed to retrieve '" + name + "' pin.")); }
                          return $If_3.call(this);
                      }
                      
                      return $If_4.call(this);
                  } catch ($boundEx) {
                      return $error($boundEx);
                  }
              }).bind(this), $error);
          } else {
              if (!cache) {
                  return pinResetCache(board, name).then((function ($await_17) {
                      try {
                          return $If_8.call(this);
                      } catch ($boundEx) {
                          return $error($boundEx);
                      }
                  }).bind(this), $error);
              }
              function $If_8() {
                  return boardPinGet(boardGet$1(board), name, Object.assign.apply(Object, [ {
                      extract: extract,
                      version: version
                  } ].concat( opts ))).then((function ($await_18) {
                      try {
                          result = $await_18;
                          return $If_3.call(this);
                      } catch ($boundEx) {
                          return $error($boundEx);
                      }
                  }).bind(this), $error);
              }
              
              return $If_8.call(this);
          }
          function $If_3() {
              manifest = pinManifestGet(result);
              if (isNull(manifest['type'])) 
                  { manifest['type'] = 'files'; }
              resultFiles = ensure(result).filter(function (e) { return !new RegExp('^' + pinVersionsPathName()).test(e); });
              resultFiles = dir.list(resultFiles, {
                  fullNames: true
              });
              if (manifest['type'] === 'files' && resultFiles.length > 1) 
                  { resultFiles = resultFiles.filter(function (e) { return !/\/data\.txt$/g.test(e); }); }
              if (signature) {
                  pinSignature = pinVersionSignature(resultFiles);
                  if (signature !== pin_signature) 
                      { return $error(new Error("Pin signature '" + pin_signature + "' does not match given signature.")); }
              }
              if (files) {
                  return $return(maybeOne(resultFiles));
              } else {
                  return $return(pinLoad({
                      _content: result,
                      class: manifest['type']
                  }));
              }
          }
          
      });
  }

  function pinRemove(name, board) {
      return new Promise(function ($return, $error) {
          board = boardGet$1(board);
          return boardPinRemove(board, name).then(function ($await_19) {
              try {
                  uiViewerUpdated(board);
                  return $return(null);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }, $error);
      });
  }

  function pinFindEmpty() {
      return dataFrame(null, {
          name: 'character',
          description: 'character',
          type: 'character',
          metadata: 'character',
          board: 'character'
      });
  }

  function pinFind(text, args) {
      return new Promise(function ($return, $error) {
          var assign;

          var allPins, boardName, boardObject, boardPins;
          var board, name, extended, metadata;
          ((assign = args, board = assign.board, name = assign.name, extended = assign.extended, metadata = assign.metadata));
          if (isNull(board) || board.length == 0) 
              { board = boardList(); }
          text = pinContentName(text);
          if (isNull(text) && !isNull(name)) 
              { text = name; }
          allPins = pinFindEmpty();
          board = ensure(board);
          var $Loop_9_trampoline, $Loop_9_local;
          function $Loop_9_step() {
              var ref = $Loop_9_local();
              var idx = ref[0];
              idx++;
              return $Loop_9.bind(this, idx);
          }
          
          function $Loop_9(idx) {
              $Loop_9_local = function () {
                  return [idx];
              };
              if (idx < board.length) {
                  boardName = board[idx];
                  boardObject = boardGet$1(boardName);
                  boardPins = null;
                  var $Try_2_Post = function () {
                      try {
                          if (extended === true) {
                              boardPins = boardPins.map(function (row) {
                                  if (row.hasOwnProperty('metadata')) {
                                      Object.assign(row, row['metadata']);
                                      delete row['metadata'];
                                  }
                                  return row;
                              });
                          }
                          if (boardPins.length > 0) {
                              boardPins = dfCBind(boardPins, dataFrame(boardPins.map(function (e) { return Object.assign(e, {
                                  board: boardName
                              }); }), {
                                  board: 'character'
                              }));
                              allPins = pinResultsMerge(allPins, boardPins, extended === true);
                          }
                          return $Loop_9_step;
                      } catch ($boundEx) {
                          return $error($boundEx);
                      }
                  };
                  var $Try_2_Catch = function (error) {
                      try {
                          pinLog("Error searching '" + boardName + "' board: " + error);
                          boardPins = boardEmptyResults();
                          return $Try_2_Post();
                      } catch ($boundEx) {
                          return $error($boundEx);
                      }
                  };
                  try {
                      return boardPinFind(boardObject, text, Object.assign({}, args)).then(function ($await_20) {
                          try {
                              boardPins = $await_20;
                              return $Try_2_Post();
                          } catch ($boundEx) {
                              return $Try_2_Catch($boundEx);
                          }
                      }, $Try_2_Catch);
                  } catch (error) {
                      $Try_2_Catch(error);
                  }
              } else 
                  { return [1]; }
          }
          
          return ($Loop_9_trampoline = (function (q) {
              while (q) {
                  if (q.then) 
                      { return void q.then($Loop_9_trampoline, $error); }
                  try {
                      if (q.pop) 
                          { if (q.length) 
                          { return q.pop() ? $Loop_9_exit.call(this) : q; }
                       else 
                          { q = $Loop_9_step; } }
                       else 
                          { q = q.call(this); }
                  } catch (_exception) {
                      return $error(_exception);
                  }
              }
          }).bind(this))($Loop_9.bind(this, 0));
          function $Loop_9_exit() {
              if (text) {
                  allPins = allPins.filter(function (e) { return e.name.includes(text) || (isNull(e.description) ? false : new RegExp(text, 'i').test(e.description)); });
              }
              if (!metadata) {
                  allPins = dfColRemove(allPins, 'metadata');
              }
              if (!isNull(name)) {
                  allPins = allPins.filter(function (e) { return new RegExp('(.*/)?' + name + '$').test(e.name); });
                  if (allPins.length) 
                      { allPins = allPins.filter(function (e, idx) { return idx === 0; }); }
              }
              allPins = allPins.sort(function (a, b) { return a.name < b.name; });
              return $return(allPins);
          }
          
      });
  }

  function pinPreview(x) {
      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

      return useMethod.apply(void 0, [ 'pinPreview', x ].concat( args ));
  }

  function pinLoad(path) {
      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

      return useMethod.apply(void 0, [ 'pinLoad', path ].concat( args ));
  }

  function pinGetOne(name, board, extended, metadata) {
      return new Promise(function ($return, $error) {
          var entry;
          return pinFind(null, {
              name: name,
              board: board,
              metadata: false,
              extended: false
          }).then(function ($await_22) {
              try {
                  entry = $await_22;
                  if (entry.length == 0) 
                      { return $error(new Error(("Pin '" + name + "' was not found."))); }
                  if (entry.length > 1) 
                      { return $error(new Error(("Pin '" + name + "' was found in multiple boards: " + (entry['board'].join(',')) + "."))); }
                  board = entry[0].board;
                  return pinFind(null, {
                      name: name,
                      board: board,
                      metadata: metadata,
                      extended: extended
                  }).then(function ($await_23) {
                      try {
                          entry = $await_23;
                          return $return(entry[0]);
                      } catch ($boundEx) {
                          return $error($boundEx);
                      }
                  }, $error);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }, $error);
      });
  }

  function pinInfo(name, args) {
      return new Promise(function ($return, $error) {
          var assign;

          var board, extended, metadata, signature, entry, files, entryExt;
          ((assign = args, board = assign.board, extended = assign.extended, metadata = assign.metadata, signature = assign.signature));
          return pinGetOne(name, board, extended, metadata).then((function ($await_24) {
              try {
                  entry = $await_24;
                  board = entry.board;
                  if (entry.metadata && entry.metadata.columns && entry.metadata.columns.length > 0) {
                      metadata = entry.metadata;
                  }
                  if (signature) {
                      return pinGet(name, {
                          board: board,
                          files: true
                      }).then((function ($await_25) {
                          try {
                              files = $await_25;
                              entry['signature'] = pinVersionSignature(files);
                              return $If_11.call(this);
                          } catch ($boundEx) {
                              return $error($boundEx);
                          }
                      }).bind(this), $error);
                  }
                  function $If_11() {
                      entryExt = Object.assign(entry);
                      delete entryExt['metadata'];
                      [].concat( Object.keys(entryExt) ).forEach(function (key) {
                          var filtered = !(entryExt[key] instanceof Array) || entryExt[key].length != 1 || !(entryExt[key][0] instanceof Array) || entryExt[key][0].length > 0;
                          if (!filtered) {
                              delete entryExt[key];
                          }
                      });
                      for (name in metadata) {
                          entryExt[name] = metadata[name];
                      }
                      return $return(Object.assign(entryExt, {
                          class: 'pin_info'
                      }));
                  }
                  
                  return $If_11.call(this);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }).bind(this), $error);
      });
  }

  var pinFetch = function () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      return useMethod.apply(void 0, [ 'pinFetch' ].concat( args ));
  };
  var pinVersions = function (name, ref) {
      var board = ref.board;
      var full = ref.full; if ( full === void 0 ) full = false;
      var rest = objectWithoutProperties( ref, ["board", "full"] );
      var args = rest;

      return new Promise(function ($return, $error) {
      var versions;
      return boardPinVersions(boardGet$1(board), name, args).then(function ($await_26) {
          try {
              versions = $await_26;
              if (!full) {
                  versions.version = boardVersionsShorten(versions.version);
              }
              return $return(versions);
          } catch ($boundEx) {
              return $error($boundEx);
          }
      }, $error);
  });
  };

  function pinManifestGet(path$1) {
      var manifest = {};
      var dataTxt = path(path$1, 'data.txt');
      if (fileExists(dataTxt)) {
          var yamlText = readLines(dataTxt).join('\n');
          manifest = safeLoad$2(yamlText);
      }
      if (isNull(manifest['type'])) 
          { manifest['type'] = 'files'; }
      return manifest;
  }

  function pinManifestUpdate(path$1, manifest) {
      var dataTxt = path(path$1, 'data.txt');
      var yamlText = safeDump$2(manifest);
      writeLines(dataTxt, yamlText.split('\n'));
  }

  function pinManifestExists(path$1) {
      return fileExists(path(path$1, 'data.txt'));
  }

  function pinManifestCreate(path$1, metadata, files) {
      var entries = Object.assign({
          path: files
      }, metadata);
      removeNulls(entries);
      var yamlText = safeDump$2(entries);
      writeLines(path(path$1, 'data.txt'), yamlText.split('\n'));
      return entries;
  }

  function pinManifestDownload(path) {
      var manifest = pinManifestGet(path);
      if (isNull(manifest['path'])) 
          { return null; }
      return pinFetch({
          path: manifest['path'],
          class: manifest['type']
      });
  }

  function pinManifestMerge(baseManifest, resourceManifest) {
      if (!isNull(resourceManifest['path']) && !isNull(baseManifest['path']) && !/https?:\/\//g.test(baseManifest['path'])) {
          baseManifest['path'] = path(baseManifest['path'], resourceManifest['path'][0]);
      }
      baseManifest = Object.assign(baseManifest, resourceManifest);
      return baseManifest;
  }

  function pinVersionsPathName() {
      return getOption('pins.versions.path', '_versions');
  }

  function pinVersionSignature$1(hashFiles) {
      var sign = hashFiles.map(function (f) { return md5(f); });
      if (sign.length > 1) {
          sign = sign.join(',');
          sign = md5(sign);
          return sign;
      } else {
          return sign[0];
      }
  }

  function pinVersionsPath(storagePath) {
      var hashFiles = dir.list(storagePath, {
          fullNames: true
      });
      hashFiles = hashFiles.filter(function (e) { return !/(\/|\\)_versions$/g.test(e); });
      var versionPath = path(pinVersionsPathName(), pinVersionSignature$1(hashFiles));
      return normalizePath(path(normalizePath(storagePath), versionPath), {
          mustWork: false
      });
  }

  function boardVersionsEnabled(board, ref) {
      if ( ref === void 0 ) ref = {
      defaultValue: false
  };
      var defaultValue = ref.defaultValue;

      if (defaultValue) {
          return board['versions'] !== false;
      } else {
          return board['versions'] === true;
      }
  }

  function boardVersionsCreate(board, name, path$1) {
      var versions = null;
      if (boardVersionsEnabled(board)) {
          var componentPath = pinStoragePath(board, name);
          var componentManifest = pinManifestGet(componentPath);
          var versions = componentManifest['versions'] || [];
          var versionPath = pinVersionsPath(path$1);
          var versionRelative = pinRegistryRelative(versionPath, path$1);
          if (versions.some(function (v) { return v === versionRelative; })) {
              versions = versions.filter(function (v) { return v !== versionRelative; });
          }
          if (dir.exists(versionPath)) {
              dir.remove(versionPath, {
                  recursive: true
              });
          }
          dir.create(versionPath, {
              recursive: true
          });
          var files = dir.list(path$1, {
              fullNames: true
          }).filter(function (e) { return e != path(path$1, pinVersionsPathName()); });
          copy(files, versionPath, {
              recursive: true
          });
          versions = [versionRelative].concat(versions);
          var manifest = pinManifestGet(path$1);
          manifest['versions'] = versions;
          pinManifestUpdate(path$1, manifest);
      }
      return versions;
  }

  function boardVersionsGet(board, name) {
      var versions = dataFrame(null, {
          versions: 'character'
      });
      var componentPath = pinStoragePath(board, name);
      var manifest = pinManifestGet(componentPath);
      versions = manifest['versions'];
      if (versions.length > 0) {
          versions = {
              version: versions
          };
      }
      return versions;
  }

  function boardVersionsShorten(versions) {
      var paths = versions.map(function (e) { return e.replace('[^/\\\\]+$', ''); });
      if (paths.filter(function (v, i, arr) { return arr.indexOf(v) === i; }).length > 0) {
          versions = versions.map(function (e) { return e.replace(/.*(\/|\\)/g, ''); });
      }
      var shortened = versions.map(function (e) { return e.substr(0, 7); });
      if (shortened.filter(function (v, i, arr) { return arr.indexOf(v) === i; }).length == versions.length) {
          versions = shortened;
      }
      return versions;
  }

  function boardVersionsExpand(versions, version) {
      var shortened = boardVersionsShorten(versions);
      var versionIndex = shortened.indexOf(version);
      if (versionIndex === -1) {
          throw new Error("Version '" + version + "' is not valid, please select from pin_versions().");
      }
      return versions[versionIndex];
  }

  function objectWithoutProperties$1 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  function boardInitializeLocal(board, ref) {
      var rest = objectWithoutProperties$1( ref, [] );
      if (!dir.exists(board['cache'])) 
          { dir.create(board['cache'], {
          recursive: true
      }); }
      return board;
  }

  function boardPinCreateLocal(board, path, name, metadata) {
      var args = [], len = arguments.length - 4;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 4 ];

      return new Promise(function ($return, $error) {
          var finalPath, toDelete;
          var basePath, params;
          boardVersionsCreate(board, name, path);
          finalPath = pinStoragePath(board, name);
          toDelete = dir.list(finalPath, {
              fullNames: true
          }).filter(function (e) { return !/(\/|\\)_versions/gi.test(e); });
          dir.remove(toDelete, {
              recursive: true
          });
          if (!dir.exists(finalPath)) {
              dir.create(finalPath);
          }
          copy(dir.list(path, {
              fullNames: true
          }), finalPath, {
              recursive: true
          });
          metadata['columns'] = null;
          basePath = boardLocalStorage(board);
          params = Object.assign({
              path: pinRegistryRelative(finalPath, basePath)
          }, metadata);
          return pinRegistryUpdate(name, board, params).then($return, $error);
      });
  }

  function boardPinFindLocal(board, text, ref) {
      var rest = objectWithoutProperties$1( ref, [] );

      return new Promise(function ($return, $error) {
          var results, metadata, path, extended, merged;
          return pinRegistryFind(text, board).then(function ($await_2) {
              try {
                  results = $await_2;
                  if (results.length == 1) {
                      metadata = results[0]['metadata'];
                      path = pinRegistryAbsolute(metadata['path'], board);
                      extended = pinManifestGet(path);
                      merged = pinManifestMerge(metadata, extended);
                      results[0]['metadata'] = merged;
                  }
                  return $return(results);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }, $error);
      });
  }

  function boardPinGetLocal(board, name, ref) {
      var rest = objectWithoutProperties$1( ref, [] );
      var args = rest;

      return new Promise(function ($return, $error) {
          var version, path$1, manifest;
          version = args['version'];
          return pinRegistryRetrievePath(name, board).then(function ($await_3) {
              try {
                  path$1 = $await_3;
                  if (!isNull(version)) {
                      manifest = pinManifestGet(pinRegistryAbsolute(path$1, board));
                      if (!manifest['versions'].includes(version)) {
                          version = boardVersionsExpand(manifest['versions'], version);
                      }
                      path$1 = path(name, version);
                  }
                  return $return(pinRegistryAbsolute(path$1, board));
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }, $error);
      });
  }

  function boardPinRemoveLocal(board, name) {
      return new Promise(function ($return, $error) {
          return pinRegistryRemove(name, board).then($return, $error);
      });
  }

  function boardPinVersionsLocal(board, name) {
      return new Promise(function ($return, $error) {
          return $return(boardVersionsGet(board, name));
      });
  }

  function objectWithoutProperties$2 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  function boardPinCreate(board, path, name, metadata) {
      var args = [], len = arguments.length - 4;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 4 ];

      return new Promise(function ($return, $error) {
          return $return(useMethodAsync.apply(void 0, [ 'boardPinCreate', board, path, name, metadata ].concat( args )));
      });
  }

  function boardInitialize(board, ref) {
      var rest = objectWithoutProperties$2( ref, [] );
      var args = rest;

      return new Promise(function ($return, $error) {
          return useMethodAsync.apply(void 0, [ 'boardInitialize', board ].concat( args )).then($return, $error);
      });
  }

  function boardInitializeDefault(board) {
      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

      throw new Error("Board '" + board['name'] + "' is not a valid board.");
  }

  function boardPinGet(board, name) {
      var args = [], len = arguments.length - 2;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

      return new Promise(function ($return, $error) {
          return $return(useMethodAsync.apply(void 0, [ 'boardPinGet', board, name ].concat( args )));
      });
  }

  function boardPinRemove(board, name) {
      var args = [], len = arguments.length - 2;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

      return new Promise(function ($return, $error) {
          return $return(useMethodAsync.apply(void 0, [ 'boardPinRemove', board, name ].concat( args )));
      });
  }

  function boardPinFind(board, text) {
      var args = [], len = arguments.length - 2;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

      return new Promise(function ($return, $error) {
          return $return(useMethodAsync.apply(void 0, [ 'boardPinFind', board, text ].concat( args )));
      });
  }

  function boardPinVersions(board, name) {
      var args = [], len = arguments.length - 2;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

      return useMethod.apply(void 0, [ 'boardPinVersions', board, name ].concat( args ));
  }

  function boardBrowseDefault(board) {
      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

      return null;
  }

  function boardEmptyResults() {
      return dataFrame(null, {
          name: 'character',
          description: 'character',
          rows: 'numeric',
          cols: 'numeric',
          class: 'numeric'
      });
  }

  function boardPinVersionsDefault(board, name) {
      var args = [], len = arguments.length - 2;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

      return dataFrame(null, {
          version: 'character'
      });
  }

  function objectWithoutProperties$3 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  function newBoard(board, name, cache, versions) {
      var args = [], len = arguments.length - 4;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 4 ];

      return new Promise(function ($return, $error) {
          if (cache == null) 
              { return $error(new Error("Please specify the 'cache' parameter.")); }
          board = {
              board: board,
              name: name,
              cache: cache,
              versions: versions,
              class: board
          };
          return boardInitialize(board, Object.assign.apply(Object, [ {
              cache: cache,
              versions: versions
          } ].concat( args ))).then(function ($await_2) {
              try {
                  board = $await_2;
                  return $return(board);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }, $error);
      });
  }

  function boardInfer(x, ref) {
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
          registerCall: registerCall
      };
      if (/^http:\/\/|^https:\/\//g.test(x)) {
          inferred['url'] = x;
          inferred['board'] = 'datatxt';
          if (name == null || x === name) {
              inferred['name'] = inferred['url'].replace(/https?:\/\//g, '').replace(/\..*$/g, '');
          }
          inferred['registerCall'] = 'pins::board_register(board = "datatxt", name = "' + inferred['name'] + '", url = "' + inferred['url'] + '")';
      }
      if (inferred['name'] == null) 
          { inferred['name'] = x; }
      if (inferred['board'] == null) 
          { inferred['board'] = x; }
      return inferred;
  }

  function boardRegisterCode(board, name) {
      return callbacks.get('boardRegisterCode')(board, name);
  }

  function boardConnect(board, code) {
      var args = [], len = arguments.length - 2;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

      var board = boardGet$1(board);
      uiViewerRegister(board, code);
      return board;
  }

  function boardDisconnect(name, args) {
      var board = boardGet$1(name);
      uiViewerClose(board);
      return board;
  }

  function boardList() {
      var defaults = concat(['local'], boardDefault());
      var boards = concat(list(), defaults);
      return unique(boards);
  }

  function boardGet$1(name) {
      if (isNull(name)) {
          name = boardDefault();
      }
      var registerCall = 'pins::board_register(board = "' + name + '")';
      if (!list().includes(name)) {
          var boardInferred = boardInfer(name, {});
          if (boardInferred['registerCall'] !== null) {
              registerCall = boardInferred['registerCall'];
          }
          name = boardInferred['name'];
          try {
              boardRegister(boardInferred['board'], {
                  name: boardInferred['name'],
                  connect: boardInferred['connect'],
                  registerCall: registerCall,
                  url: boardInferred['url']
              });
          } catch (err) {
              pinLog(("Failed to register board " + name + ": " + (err.toString())));
          }
          if (!list().includes(name)) {
              throw ("Board '" + name + "' not a board, available boards: " + (boardList().join(', ')));
          }
      }
      return get$1(name);
  }

  function boardRegister(board, ref) {
      var name = ref.name;
      var cache = ref.cache;
      var versions = ref.versions;
      var rest = objectWithoutProperties$3( ref, ["name", "cache", "versions"] );
      var args = rest;

      return new Promise(function ($return, $error) {
          var inferred;
          if (name == null) 
              { name = board; }
          if (cache == null) 
              { cache = boardCachePath(); }
          inferred = boardInfer(board, {
              board: board,
              name: name,
              registerCall: args['registerCall'],
              connect: args['connect'],
              url: args['url']
          });
          args['url'] = inferred['url'];
          return newBoard(inferred['board'], inferred['name'], cache, versions, args).then(function ($await_3) {
              try {
                  board = $await_3;
                  set$1(inferred['name'], board);
                  if (inferred['registerCall'] == null) 
                      { inferred['registerCall'] = boardRegisterCode(board['name'], inferred['name']); }
                  if (inferred['connect'] !== false) 
                      { boardConnect(board['name'], inferred['registerCall']); }
                  return $return(inferred['name']);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }, $error);
      });
  }

  function boardDeregister(name, args) {
      if ( args === void 0 ) args = {};

      if (!list().includes(name)) {
          throw ("Board '" + name + "' is not registered");
      }
      var board = boardGet$1(name);
      if (args.disconnect) {
          boardDisconnect(name);
      }
      remove(name);
      return null;
  }

  var BoardName = Object.freeze({
      kaggle: 'kaggle'
  });

  function pinDefaultName(x, board) {
      var name = basename(x);
      var error = new Error("Can't auto-generate pin name from object, please specify the 'name' parameter.");
      if (!name) {
          throw error;
      }
      var sanitized = name.replace(/[^a-zA-Z0-9-]/g, '-').replace(/^-*|-*$/g, '').replace(/-+/g, '-');
      if (!sanitized) {
          throw error;
      }
      if (board === BoardName.kaggle && sanitized.length < 5) {
          return (sanitized + "-pin");
      }
      return sanitized;
  }

  function pinsMergeCustomMetadata(metadata, customMetadata) {
      var fixedFields = ['rows','cols','name','description'];
      namesArr(customMetadata).forEach(function (entry) {
          if (entry === 'columns') {
              var fixedColumnnFields = ['name','type'];
              if (Array.isArray(metadata['columns'])) {
                  metadata['columns'] = metadata['columns'].map(function (x, i) { return ({
                      name: Object.keys(metadata['columns'])[i],
                      type: metadata['columns'][i]
                  }); });
              }
              customMetadata['columns'].forEach(function (column) {
                  var foundIdx = metadata.columns.filter(function (e, i) { return metadata['columns'][i]['name'] === column['name']; });
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
  }

  var fetch = function () { return callbacks.get('fetch'); };

  function objectWithoutProperties$4 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  function pinString(x, opts) {
      if ( opts === void 0 ) opts = {
      name: null,
      description: null,
      board: null
  };

      return new Promise(function ($return, $error) {
          var assign, rest;

          var name, description, board, args, paths, extension;
          ((assign = opts, name = assign.name, description = assign.description, board = assign.board, rest = objectWithoutProperties$4( assign, ["name", "description", "board"] ), args = rest));
          paths = ensure(x);
          extension = paths.length > 0 ? 'zip' : tools.fileExt(paths);
          return boardPinStore(board, Object.assign.apply(Object, [ {}, {
              name: name,
              description: description,
              path: paths,
              type: 'files',
              metadata: {
                  extension: extension
              }
          } ].concat( args ))).then($return, $error);
      });
  }

  function pinFileCacheMaxAge(cacheControl) {
      if (!cacheControl) 
          { return null; }
      var maxAge = new RegExp('max-age').test(cacheControl);
      if (maxAge.length !== 1) 
          { return null; }
      maxAge = cacheControl.replace(/.*max-age=/, '');
      return parseFloat(maxAge.replace(/,.*$/, ''));
  }

  function pinDownloadOne(path$1, ref) {
      var name = ref.name;
      var component = ref.component;
      var extract = ref.extract;
      var customEtag = ref.customEtag; if ( customEtag === void 0 ) customEtag = '';
      var removeQuery = ref.removeQuery;
      var config = ref.config;
      var headers = ref.headers;
      var canFail = ref.canFail;
      var cache = ref.cache; if ( cache === void 0 ) cache = true;
      var contentLength = ref.contentLength; if ( contentLength === void 0 ) contentLength = 0;
      var subpath = ref.subpath;
      var details = ref.details; if ( details === void 0 ) details = {};
      var download = ref.download; if ( download === void 0 ) download = true;

      return new Promise(function ($return, $error) {
          var fetch$1, mustDownload, localPath, tempfile$1, oldPin, oldCache, oldCacheMissing, cacheIndex, reportError, catchLog, catchError, error, extractType, newCache, files, relativePath;
          if (!subpath) 
              { subpath = name; }
          fetch$1 = fetch();
          mustDownload = !cache;
          name = name.replace('^https?://', '');
          localPath = pinStoragePath(component, subpath);
          if (!download) {
              return $return(localPath);
          }
          tempfile$1 = tempfile();
          dir.create(tempfile$1);
          return pinRegistryRetrieveMaybe(name, component).then((function ($await_11) {
              try {
                  oldPin = $await_11 || {};
                  oldCache = oldPin.cache;
                  oldCacheMissing = true;
                  cacheIndex = 0;
                  if (!oldCache) {
                      oldPin.cache = {};
                      oldCache = {};
                      cacheIndex = 1;
                  } else {
                      var cacheUrls;
                      cacheUrls = Object.keys(oldCache).map(function (k) { return oldCache[k].url; });
                      cacheIndex = cacheUrls.findIndex(function (u) { return u === path$1; });
                      if (cacheIndex === -1) {
                          oldCache = {};
                          cacheIndex = cacheUrls.length + 1;
                      } else {
                          oldCache = oldCache[cacheIndex];
                          oldCacheMissing = false;
                      }
                  }
                  reportError = (function (e) {
                      if (oldCacheMissing) {
                          throw new Error(e);
                      } else {
                          pinLog(e);
                      }
                  });
                  catchLog = (function (func) { return tryCatch(func, function (e) {
                      pinLog(e.message);
                  }); });
                  catchError = oldCacheMissing ? function (func) { return func; } : function (func) { return tryCatch(func, function (e) {
                      reportError(e.message);
                  }); };
                  if (canFail) {
                      reportError = (function (e) {
                          details.error = e;
                      });
                  }
                  cache = {};
                  cache.etag = oldCache.etag || '';
                  cache.maxAge = oldCache.maxAge || 0;
                  cache.changeAge = oldCache.changeAge || new Date().getTime() - cache.maxAge;
                  cache.url = path$1;
                  error = null;
                  extractType = null;
                  pinLog(("Checking 'changeAge' header (time, change age, max age): " + (new Date()) + ", " + (cache.changeAge) + ", " + (cache.maxAge)));
                  details.somethingChanged = false;
                  if (new Date().getTime() >= cache.changeAge + cache.maxAge || mustDownload) {
                      var skipDownload, etagChanged;
                      skipDownload = false;
                      if (customEtag && customEtag.length) {
                          pinLog(("Using custom 'etag' (old, new): " + (oldCache.etag) + ", " + customEtag));
                          cache.etag = customEtag;
                          return $If_2.call(this);
                      } else {
                          var headResult;
                          headResult = fetch$1(path$1, {
                              method: 'HEAD',
                              headers: headers
                          });
                          if (headResult.then) {
                              return headResult.then((function ($await_12) {
                                  try {
                                      headResult = $await_12;
                                      return $If_7.call(this);
                                  } catch ($boundEx) {
                                      return $error($boundEx);
                                  }
                              }).bind(this), $error);
                          }
                          function $If_7() {
                              if (headResult) {
                                  cache.etag = headResult.headers.etag || '';
                                  cache.changeAge = new Date().getTime();
                                  cache.maxAge = pinFileCacheMaxAge(headResult.headers['cache-control']) || cache.changeAge * 2;
                                  contentLength = headResult.headers['content-length'];
                                  pinLog(("Checking 'etag' (old, new):  " + (oldCache.etag) + ", " + (cache.etag)));
                              }
                              return $If_2.call(this);
                          }
                          
                          return $If_7.call(this);
                      }
                      function $If_2() {
                          etagChanged = cache.etag || oldCache.etag !== cache.etag;
                          if (oldCacheMissing || etagChanged || mustDownload) {
                              var downloadName, destinationPath, result;
                              downloadName = basename(path$1);
                              if (removeQuery) {
                                  downloadName = downloadName.split('/')[0];
                              }
                              destinationPath = path(tempfile$1, downloadName);
                              pinLog(("Downloading " + path$1 + " to " + destinationPath));
                              details.somethingChanged = true;
                              result = fetch$1(path$1, {
                                  method: 'GET',
                                  headers: headers
                              });
                              if (result.then) {
                                  return result.then((function ($await_13) {
                                      try {
                                          result = $await_13;
                                          return $If_4.call(this);
                                      } catch ($boundEx) {
                                          return $error($boundEx);
                                      }
                                  }).bind(this), $error);
                              }
                              function $If_4() {
                                  if (!result.ok) {
                                      pinLog(("Failed to download remote file: " + path$1));
                                      return $If_5.call(this);
                                  } else {
                                      var contentType, text;
                                      contentType = result.headers['content-type'];
                                      text = typeof result.text === 'function' ? result.text() : result.text;
                                      if (text.then) {
                                          return text.then((function ($await_14) {
                                              try {
                                                  text = $await_14;
                                                  return $If_6.call(this);
                                              } catch ($boundEx) {
                                                  return $error($boundEx);
                                              }
                                          }).bind(this), $error);
                                      }
                                      function $If_6() {
                                          write(text, destinationPath);
                                          if (contentType) {
                                              extractType = contentType.replace(/application\/(x-)?/, '');
                                              if (['application/octet-stream','application/zip'].includes(contentType)) {}
                                          }
                                          return $If_5.call(this);
                                      }
                                      
                                      return $If_6.call(this);
                                  }
                                  function $If_5() {
                                      return $If_3.call(this);
                                  }
                                  
                              }
                              
                              return $If_4.call(this);
                          }
                          function $If_3() {
                              return $If_1.call(this);
                          }
                          
                          return $If_3.call(this);
                      }
                      
                  }
                  function $If_1() {
                      if (error) 
                          { return $return(); }
                      newCache = oldPin.cache;
                      newCache[cacheIndex] = cache;
                      if (extract) {
                          extractType = extract;
                          extract = true;
                      }
                      files = dir.list(tempfile$1, {
                          fullNames: true
                      });
                      if (extractType && extract) {}
                      files.forEach(function (file) {
                          copy(file, localPath, {
                              overwrite: true,
                              recursive: true
                          });
                      });
                      relativePath = localPath.replace(pinStoragePath(component, ''), '');
                      return pinRegistryUpdate(name, component, {
                          path: oldPin.path || relativePath,
                          cache: newCache
                      }).then(function ($await_15) {
                          try {
                              return $return(localPath);
                          } catch ($boundEx) {
                              return $error($boundEx);
                          }
                      }, $error);
                  }
                  
                  return $If_1.call(this);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }).bind(this), $error);
      });
  }

  function pinDownload(path, args) {
      return new Promise(function ($return, $error) {
          if (typeof path === 'string') {
              return pinDownloadOne(path, args).then($return, $error);
          } else {
              var result;
              result = [];
              var $Loop_9_trampoline, $Loop_9_local;
              function $Loop_9_step() {
                  var ref = $Loop_9_local();
                  var idx = ref[0];
                  idx++;
                  return $Loop_9.bind(this, idx);
              }
              
              function $Loop_9(idx) {
                  $Loop_9_local = function () {
                      return [idx];
                  };
                  if (idx < path.length) {
                      return pinDownloadOne(path[idx], args).then(function ($await_17) {
                          try {
                              result.push($await_17);
                              return $Loop_9_step;
                          } catch ($boundEx) {
                              return $error($boundEx);
                          }
                      }, $error);
                  } else 
                      { return [1]; }
              }
              
              return ($Loop_9_trampoline = (function (q) {
                  while (q) {
                      if (q.then) 
                          { return void q.then($Loop_9_trampoline, $error); }
                      try {
                          if (q.pop) 
                              { if (q.length) 
                              { return q.pop() ? $Loop_9_exit.call(this) : q; }
                           else 
                              { q = $Loop_9_step; } }
                           else 
                              { q = q.call(this); }
                      } catch (_exception) {
                          return $error(_exception);
                      }
                  }
              }).bind(this))($Loop_9.bind(this, 0));
              function $Loop_9_exit() {
                  return $return(result);
              }
              
          }
      });
  }

  function objectWithoutProperties$5 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }

  function boardPinStore(board, opts) {
      return new Promise(function ($return, $error) {
          var assign, rest;

          var path$1, description, type, metadata, extract, retrieve, args, customMetadata, zip;
          var boardInstance, name, storePath;
          ((assign = Object.assign({
              retrieve: true
          }, opts), path$1 = assign.path, description = assign.description, type = assign.type, metadata = assign.metadata, extract = assign.extract, retrieve = assign.retrieve, rest = objectWithoutProperties$5( assign, ["path", "description", "type", "metadata", "extract", "retrieve"] ), args = rest));
          path$1 = ensure(path$1);
          customMetadata = args['customMetadata'];
          zip = args['zip'];
          if (isNull(extract)) 
              { extract = true; }
          boardInstance = boardGet$1(board);
          name = opts.name || vectorize()(pinPath);
          pinLog(("Storing " + name + " into board " + (boardInstance.name) + " with type " + type));
          if (!args.cache) {
              return pinResetCache(boardInstance, name).then((function ($await_6) {
                  try {
                      return $If_3.call(this);
                  } catch ($boundEx) {
                      return $error($boundEx);
                  }
              }).bind(this), $error);
          }
          function $If_3() {
              path$1 = path$1.filter(function (x) { return !/data\.txt/g.test(x); });
              storePath = tempfile();
              dir.create(storePath);
              return onExit(function () { return dir.remove(storePath, {
                  recursive: true
              }); }, function () { return new Promise(function ($return, $error) {
                  var manifest, findCommonPath, commonPath;
                  var somethingChanged;
                  if (path$1.length == 1 && /^http/g.test(path$1) && !/\\.[a-z]{2,4}$/g.test(path$1) && getOption('pins.search.datatxt', true)) {
                      var datatxtPath;
                      datatxtPath = path(path$1, 'data.txt');
                      var localPath;
                      localPath = pinDownload(datatxtPath, name, boardDefault());
                      if (localPath) {
                          manifest = null;
                          try {
                              manifest = pinManifestGet(localPath);
                          } catch (error) {
                              fileRemove(path(localPath, 'data.txt'));
                          }
                          if (!isNull(manifest) && !isNull(manifest[path$1])) {
                              path$1 = path$1 + "/" + (manifest[path$1]);
                              extract = false;
                          }
                      }
                  }
                  somethingChanged = false;
                  if (zip) {
                      findCommonPath = function (path) {
                          var common = path[0];
                          if (all(path, function (common) { return startsWith(common); }) || common === dirname(common)) 
                              { return common; }
                          return findCommonPath(dirname(common[0]));
                      };
                      commonPath = findCommonPath(path$1);
                      dir.zip(commonPath.map(function (e) { return e.replace(common_path + '/', ''); }), path(storePath, 'data.zip'), commonPath);
                      somethingChanged = true;
                  } else {
                      path$1.forEach(function (singlePath, idxPath) {
                          var details = {
                              somethingChanged: true
                          };
                          if (/^http/g.test(singlePath)) {
                              singlePath = pinDownload(singlePath, name, boardDefault(), Object.assign({
                                  extract: extract,
                                  details: details,
                                  canFail: true
                              }, opt));
                              if (!isNull(details['error'])) {
                                  var cachedResult = null;
                                  try {
                                      pinGet(name, {
                                          board: boardDefault()
                                      });
                                  } catch (error) {}
                                  if (isNull(cachedResult)) {
                                      throw new Error(details['error']);
                                  } else {
                                      pinLog(details['error']);
                                  }
                                  return cachedResult;
                              }
                          }
                          if (details.somethingChanged) {
                              var copyOrLink = function (from, to) {
                                  if (fileExists(from) && fileSize(from) >= getOption('pins.link.size', Math.pow(10, 8)) && supportsLinks()) 
                                      { createLink(from, path(to, basename(from))); }
                                   else 
                                      { copy(from, to, {
                                      recursive: true
                                  }); }
                              };
                              if (dir.exists(singlePath)) {
                                  dir.list(singlePath, {
                                      fullNames: true
                                  }).forEach(function (entry) { return copyOrLink(entry, storePath); });
                              } else {
                                  copyOrLink(singlePath, storePath);
                              }
                              somethingChanged = true;
                          }
                      });
                  }
                  if (somethingChanged) {
                      if (!pinManifestExists(storePath)) {
                          metadata.description = description;
                          metadata.type = type;
                          metadata = pinsMergeCustomMetadata(metadata, customMetadata);
                          pinManifestCreate(storePath, metadata, dir.list(storePath, {
                              recursive: true
                          }));
                      }
                      return boardPinCreate.apply(void 0, [ boardInstance, storePath, name, metadata ].concat( args )).then((function ($await_7) {
                          try {
                              uiViewerUpdated(boardInstance);
                              return $If_4.call(this);
                          } catch ($boundEx) {
                              return $error($boundEx);
                          }
                      }).bind(this), $error);
                  }
                  function $If_4() {
                      if (retrieve) {
                          return pinGet(name, Object.assign.apply(Object, [ {
                              board: boardInstance['name']
                          } ].concat( args ))).then($return, $error);
                      } else {
                          return $return(null);
                      }
                  }
                  
                  return $If_4.call(this);
              }); }).then($return, $error);
          }
          
          return $If_3.call(this);
      });
  }

  function objectWithoutProperties$6 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  function pinDefault(x, opts) {
      if ( opts === void 0 ) opts = {};

      return new Promise(function ($return, $error) {
          var assign, rest;

          var description, board, args, name, path$1;
          ((assign = opts, description = assign.description, board = assign.board, rest = objectWithoutProperties$6( assign, ["description", "board"] ), args = rest));
          name = opts.name || pinDefaultName(x, board);
          path$1 = tempfile();
          dir.create(path$1);
          write(JSON.stringify(x), path(path$1, 'data.json'));
          return boardPinStore(board, Object.assign.apply(Object, [ {}, {
              name: name,
              description: description,
              path: path$1,
              type: 'default',
              metadata: []
          } ].concat( args ))).then($return, $error);
      });
  }

  var pinPreviewDefault = function (x) {
      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

      return x;
  };
  function pinLoadDefault(path$1) {
      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

      return JSON.parse(read(path(path$1, 'data.json')));
  }

  var pinFetchDefault = function (args) { return args['path']; };

  function boardDatatxtHeaders(board, path, verb, file) {
      if ( verb === void 0 ) verb = 'GET';

      if (board.url) {
          path = path.replace(("^" + (board.url) + "/?"), '');
      }
      if (typeof board.headers === 'function') {
          return board.headers(board, verb, path, file);
      } else if (board.headers && (board.headers.length || typeof board.headers === 'string' || board.headers['request']) || !board.headers) {
          return board.headers;
      } else {
          throw ("Unsupported class for board headers: " + (typeof board.headers));
      }
  }

  function boardManifestGet(path, defaultEmpty) {
      if ( defaultEmpty === void 0 ) defaultEmpty = false;

      if (!fileExists(path) && defaultEmpty) {
          return [];
      }
      var yamlText = readLines(path).join('\n');
      var result = safeLoad$2(yamlText);
      return !(!result.map) ? result : [result];
  }

  function boardManifestCreate(index, file) {
      var yamlText = safeDump$2(index);
      writeLines(file, yamlText.split('\n'));
  }

  function boardManifestLoad(manifest) {
      var result = safeLoad$2(manifest);
      return !(!result.map) ? result : [result];
  }

  function objectWithoutProperties$7 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  function datatxtRefreshIndex(board) {
      return new Promise(function ($return, $error) {
          var indexFile, indexUrl, headers, fetch$1, response, data, tempfile$1, localIndex, currentIndex, newIndex, yamlText;
          if (!board.url) {
              return $error(new Error(("Invalid 'url' in '" + (board.name) + "' board.")));
          }
          indexFile = 'data.txt';
          if (board.indexRandomize) {
              indexFile += "?rand=" + (Math.round(Math.random() * 1e8));
          }
          indexUrl = path(board.url, indexFile);
          headers = boardDatatxtHeaders(board, 'data.txt');
          fetch$1 = fetch();
          response = fetch$1(indexUrl, {
              method: 'GET',
              headers: headers
          });
          if (response.then) {
              return response.then((function ($await_26) {
                  try {
                      response = $await_26;
                      return $If_4.call(this);
                  } catch ($boundEx) {
                      return $error($boundEx);
                  }
              }).bind(this), $error);
          }
          function $If_4() {
              if (!response.ok) {
                  return $error(new Error(("Failed to retrieve data.txt file from " + (board.url) + ".")));
              }
              data = typeof response.text === 'function' ? response.text() : response.text;
              if (data.then) {
                  return data.then((function ($await_27) {
                      try {
                          data = $await_27;
                          return $If_5.call(this);
                      } catch ($boundEx) {
                          return $error($boundEx);
                      }
                  }).bind(this), $error);
              }
              function $If_5() {
                  tempfile$1 = tempfile();
                  write(data, tempfile$1);
                  localIndex = path(boardLocalStorage(board), 'data.txt');
                  currentIndex = boardManifestGet(localIndex, true);
                  newIndex = boardManifestGet(tempfile$1);
                  fileRemove(tempfile$1);
                  newIndex = newIndex.map(function (newEntry) {
                      var currentEntry = currentIndex.filter(function (ci) { return ci.path === newEntry.path; });
                      if (currentEntry.length === 1) {
                          newEntry.cache = currentEntry[0].cache || null;
                      }
                      return newEntry;
                  });
                  currentIndex = newIndex;
                  yamlText = safeDump$2(currentIndex);
                  writeLines(localIndex, yamlText.split('\n'));
                  return $return();
              }
              
              return $If_5.call(this);
          }
          
          return $If_4.call(this);
      });
  }

  function datatxtPinDownloadInfo(board, name, args) {
      var index = boardManifestGet(path(boardLocalStorage(board), 'data.txt'));
      index = index.filter(function (v) { return v.name === name; });
      if (!index.length && board.needsIndex) {
          throw new Error(("Could not find '" + name + "' pin in '" + (board.name) + "' board."));
      }
      var indexEntry = index.length ? index[0] : {
          path: name
      };
      var pathGuess = new RegExp('.*/.*\\.[a-zA-Z]+$').test(indexEntry.path) ? dirname(indexEntry.path) : indexEntry.path;
      pathGuess = new RegExp('^https?://').test(pathGuess) ? pathGuess : path(board.url, pathGuess);
      return {
          pathGuess: pathGuess,
          indexEntry: indexEntry
      };
  }

  function datatxtRefreshManifest(board, name, download, args) {
      return new Promise(function ($return, $error) {
          var assign;

          var pathGuess, indexEntry, downloadPath;
          ((assign = datatxtPinDownloadInfo(board, name), pathGuess = assign.pathGuess, indexEntry = assign.indexEntry));
          downloadPath = path(pathGuess, 'data.txt');
          return pinDownload(downloadPath, {
              name: name,
              component: board,
              canFail: true,
              download: download,
              headers: boardDatatxtHeaders(board, downloadPath)
          }).then(function ($await_28) {
              try {
                  return $return({
                      pathGuess: pathGuess,
                      indexEntry: indexEntry,
                      downloadPath: downloadPath
                  });
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }, $error);
      });
  }

  function datatxtUploadFiles(ref) {
      var board = ref.board;
      var name = ref.name;
      var files = ref.files;
      var path$1 = ref.path;

      return new Promise(function ($return, $error) {
          var $Loop_6_trampoline, $Loop_6_local;
          function $Loop_6_step() {
              var ref = $Loop_6_local();
              var idx = ref[0];
              idx++;
              return $Loop_6.bind(this, idx);
          }
          
          function $Loop_6(idx) {
              $Loop_6_local = function () {
                  return [idx];
              };
              if (idx < files.length) {
                  var file, subpath, uploadUrl, filePath, fetch$1, data, response;
                  file = files[idx];
                  subpath = path(name, file).replace(/\/\//g, '/');
                  uploadUrl = path(board.url, subpath);
                  filePath = normalizePath(path(path$1, file));
                  fetch$1 = fetch();
                  data = read(filePath);
                  response = fetch$1(uploadUrl, {
                      method: 'PUT',
                      body: data,
                      headers: boardDatatxtHeaders(board, subpath, 'PUT', filePath)
                  });
                  if (response.then) {
                      return response.then((function ($await_29) {
                          try {
                              response = $await_29;
                              return $If_8.call(this);
                          } catch ($boundEx) {
                              return $error($boundEx);
                          }
                      }).bind(this), $error);
                  }
                  function $If_8() {
                      if (!response.ok) {
                          return $error(new Error(("Failed to upload '" + file + "' to '" + uploadUrl + "'. Error: " + (response.statusText))));
                      }
                      return $Loop_6_step;
                  }
                  
                  return $If_8.call(this);
              } else 
                  { return [1]; }
          }
          
          return ($Loop_6_trampoline = (function (q) {
              while (q) {
                  if (q.then) 
                      { return void q.then($Loop_6_trampoline, $error); }
                  try {
                      if (q.pop) 
                          { if (q.length) 
                          { return q.pop() ? $Loop_6_exit.call(this) : q; }
                       else 
                          { q = $Loop_6_step; } }
                       else 
                          { q = q.call(this); }
                  } catch (_exception) {
                      return $error(_exception);
                  }
              }
          }).bind(this))($Loop_6.bind(this, 0));
          function $Loop_6_exit() {
              return $return();
          }
          
      });
  }

  function datatxtUpdateIndex(ref) {
      var board = ref.board;
      var path$1 = ref.path;
      var operation = ref.operation;
      var name = ref.name;
      var metadata = ref.metadata;

      return new Promise(function ($return, $error) {
          var indexFile, indexUrl, indexFileGet, fetch$1, getResponse, index, indexPos, normalizedFile, data, putResponse;
          indexFile = 'data.txt';
          indexUrl = path(board.url, indexFile);
          indexFileGet = 'data.txt';
          if (board.indexRandomize) {
              indexFileGet = indexFile + "?rand=" + (Math.pow(Math.random() * 10, 8));
          }
          fetch$1 = fetch();
          getResponse = fetch$1(path(board.url, indexFileGet), {
              method: 'GET',
              headers: boardDatatxtHeaders(board, indexFileGet)
          });
          if (getResponse.then) {
              return getResponse.then((function ($await_30) {
                  try {
                      getResponse = $await_30;
                      return $If_9.call(this);
                  } catch ($boundEx) {
                      return $error($boundEx);
                  }
              }).bind(this), $error);
          }
          function $If_9() {
              index = [];
              if (getResponse.ok) {
                  var respText;
                  respText = typeof getResponse.text === 'function' ? getResponse.text() : getResponse.text;
                  if (respText.then) {
                      return respText.then((function ($await_31) {
                          try {
                              respText = $await_31;
                              return $If_14.call(this);
                          } catch ($boundEx) {
                              return $error($boundEx);
                          }
                      }).bind(this), $error);
                  }
                  function $If_14() {
                      index = boardManifestLoad(respText);
                      return $If_10.call(this);
                  }
                  
                  return $If_14.call(this);
              } else {
                  if (operation === 'remove') {
                      return $error(new Error('Failed to retrieve latest data.txt file, the pin was partially removed.'));
                  }
                  return $If_10.call(this);
              }
              function $If_10() {
                  indexPos = index.findIndex(function (i) { return i.path === path$1; });
                  if (indexPos === -1) {
                      indexPos = index.length;
                  }
                  if (operation === 'create') {
                      Object.keys(metadata).forEach(function (key) {
                          if (!metadata[key]) 
                              { metadata[key] = null; }
                      });
                      metadata.columns = null;
                      index[indexPos] = {
                          path: path$1
                      };
                      if (name) {
                          index[indexPos].name = name;
                      }
                      Object.assign.apply(Object, [ index[indexPos] ].concat( metadata ));
                  } else if (operation === 'remove') {
                      if (indexPos <= index.length) {
                          index.splice(indexPos, 1);
                      }
                  } else {
                      return $error(new Error(("Operation " + operation + " is unsupported.")));
                  }
                  indexFile = path(boardLocalStorage(board), 'data.txt');
                  boardManifestCreate(index, indexFile);
                  normalizedFile = normalizePath(indexFile);
                  data = read(normalizedFile);
                  putResponse = fetch$1(indexUrl, {
                      method: 'PUT',
                      body: data,
                      headers: boardDatatxtHeaders(board, 'data.txt', 'PUT', normalizedFile)
                  });
                  if (putResponse.then) {
                      return putResponse.then((function ($await_32) {
                          try {
                              putResponse = $await_32;
                              return $If_11.call(this);
                          } catch ($boundEx) {
                              return $error($boundEx);
                          }
                      }).bind(this), $error);
                  }
                  function $If_11() {
                      if (!putResponse.ok) {
                          var respText;
                          respText = typeof putResponse.text === 'function' ? putResponse.text() : putResponse.text;
                          return new Promise(function ($return, $error) {
                              if (respText.then) {
                                  return respText.then($return, $error);
                              }
                              return $return(respText);
                          }).then(function ($await_34) {
                              try {
                                  return $error(new Error(("Failed to update data.txt file: " + $await_34)));
                              } catch ($boundEx) {
                                  return $error($boundEx);
                              }
                          }, $error);
                      }
                      if (board.indexUpdated && operation === 'create') {
                          board.indexUpdated(board);
                      }
                      return $return();
                  }
                  
                  return $If_11.call(this);
              }
              
          }
          
          return $If_9.call(this);
      });
  }

  function datatxtPinFiles(board, name) {
      return new Promise(function ($return, $error) {
          var entry, metadata, files;
          return boardPinFindDatatxt(board, null, {
              name: name
          }).then(function ($await_35) {
              try {
                  entry = $await_35;
                  if (entry.length !== 1) {
                      return $error(new Error(("Pin '" + name + "' not found.")));
                  }
                  metadata = entry[0]['metadata'];
                  files = typeof metadata.path === 'string' ? [metadata.path] : metadata.path;
                  if (metadata.versions) {
                      metadata.versions.forEach(function (version) { return new Promise(function ($return, $error) {
                          var pathGuess, downloadPath, localPath, subpath, manifest;
                          pathGuess = datatxtPinDownloadInfo(board, name).pathGuess;
                          downloadPath = path(path(pathGuess, version), 'data.txt');
                          localPath = path(pinStoragePath(board, name), version);
                          subpath = path(name, version);
                          return pinDownload(downloadPath, {
                              name: name,
                              component: board,
                              canFail: true,
                              headers: boardDatatxtHeaders(board, downloadPath),
                              subpath: subpath
                          }).then(function ($await_36) {
                              try {
                                  manifest = pinManifestGet(localPath);
                                  files = files.concat([path(subpath, manifest.path),
                                      path(subpath, 'data.txt')]);
                                  return $return();
                              } catch ($boundEx) {
                                  return $error($boundEx);
                              }
                          }, $error);
                      }); });
                  }
                  return $return(files);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }, $error);
      });
  }

  function boardInitializeDatatxt(board, args) {
      return new Promise(function ($return, $error) {
          var assign, rest;

          var url, browseUrl, headers, bucket, indexUpdated, indexRandomize, needsIndex, cache, params;
          ((assign = args, url = assign.url, browseUrl = assign.browseUrl, headers = assign.headers, bucket = assign.bucket, indexUpdated = assign.indexUpdated, indexRandomize = assign.indexRandomize, indexRandomize = indexRandomize === void 0 ? false : indexRandomize, needsIndex = assign.needsIndex, needsIndex = needsIndex === void 0 ? true : needsIndex, cache = assign.cache, cache = cache === void 0 ? boardCachePath() : cache, rest = objectWithoutProperties$7( assign, ["url", "browseUrl", "headers", "bucket", "indexUpdated", "indexRandomize", "needsIndex", "cache"] ), params = rest));
          if (!url) {
              return $error(new Error("The 'datatxt' board requires a 'url' parameter."));
          }
          board.url = url.replace(/(\/)?data.txt$/g, '');
          board.headers = headers;
          board.needsIndex = needsIndex;
          board.browseUrl = browseUrl || url;
          board.indexUpdated = indexUpdated;
          board.bucket = bucket;
          board.indexRandomize = indexRandomize;
          Object.keys(params).forEach(function (key) {
              board[key] = params[key];
          });
          return datatxtRefreshIndex(board).then(function ($await_37) {
              try {
                  return $return(board);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }, $error);
      });
  }

  function boardPinGetDatatxt(board, name, args) {
      return new Promise(function ($return, $error) {
          var assign, rest;

          var extract, version, download, opts, manifestPaths, indexEntry, pathGuess, downloadPath, localPath, manifest;
          ((assign = args, extract = assign.extract, version = assign.version, download = assign.download, download = download === void 0 ? true : download, rest = objectWithoutProperties$7( assign, ["extract", "version", "download"] ), opts = rest));
          return datatxtRefreshManifest(board, name, download).then((function ($await_38) {
              var assign;

              try {
                  manifestPaths = $await_38;
                  ((assign = manifestPaths, indexEntry = assign.indexEntry));
                  pathGuess = manifestPaths.pathGuess;
                  downloadPath = manifestPaths.downloadPath;
                  localPath = pinStoragePath(board, name);
                  manifest = pinManifestGet(localPath);
                  if (version) {
                      if (!manifest.versions.includes(version)) {
                          version = boardVersionsExpand(manifest.versions, version);
                      }
                      downloadPath = path(pathGuess, path(version, 'data.txt'));
                      localPath = path(localPath, version);
                      return pinDownload(downloadPath, {
                          name: name,
                          component: board,
                          canFail: true,
                          headers: boardDatatxtHeaders(board, downloadPath),
                          subpath: path(name, version)
                      }).then((function ($await_39) {
                          try {
                              manifest = pinManifestGet(localPath);
                              pathGuess = path(pathGuess, version);
                              return $If_15.call(this);
                          } catch ($boundEx) {
                              return $error($boundEx);
                          }
                      }).bind(this), $error);
                  }
                  function $If_15() {
                      if (manifest) {
                          downloadPath = indexEntry.path;
                          var pinManifest;
                          pinManifest = pinManifestDownload(localPath);
                          if (pinManifest) {
                              downloadPath = '';
                              if (new RegExp('^https?://').test(pinManifest)) {
                                  downloadPath = pinManifest;
                              } else if (pinManifest instanceof Array) {
                                  var index;
                                  index = pinManifest.findIndex(function (v) { return v.includes('.txt') || v.includes('.json'); });
                                  downloadPath = path(pathGuess, pinManifest[index === -1 ? 0 : index]);
                              } else {
                                  downloadPath = path(pathGuess, pinManifest);
                              }
                          } else {
                              indexEntry.path = null;
                              pinManifestCreate(localPath, indexEntry, indexEntry.path);
                          }
                      } else {
                          downloadPath = path(board.url, name);
                      }
                      if (!new RegExp('https?://').test(downloadPath)) {
                          downloadPath = path(board.url, downloadPath);
                      }
                      return pinDownload(downloadPath, {
                          name: name,
                          component: board,
                          extract: extract,
                          download: download,
                          headers: boardDatatxtHeaders(board, downloadPath)
                      }).then(function ($await_40) {
                          try {
                              localPath = $await_40;
                              return $return(localPath);
                          } catch ($boundEx) {
                              return $error($boundEx);
                          }
                      }, $error);
                  }
                  
                  return $If_15.call(this);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }).bind(this), $error);
      });
  }

  function boardPinFindDatatxt(board, text, args) {
      return new Promise(function ($return, $error) {
          var entries, results;
          return datatxtRefreshIndex(board).then((function ($await_41) {
              try {
                  entries = boardManifestGet(path(boardLocalStorage(board), 'data.txt'));
                  if (args.extended) {
                      return $return(entries);
                  }
                  results = entries.map(function (e) { return ({
                      name: e.name || basename(e.path),
                      description: e.description || '',
                      type: e.type || 'files',
                      metadata: e,
                      stringsAsFactors: false
                  }); });
                  if (args.name) {
                      results = results.filter(function (i) { return i.name === args.name; });
                  }
                  if (results.length === 1) {
                      var metadata, pathGuess, datatxtPath, fetch$1, response;
                      metadata = results[0].metadata;
                      pathGuess = new RegExp('\\.[a-zA-Z]+$').test(metadata.path) ? dirname(metadata.path) : metadata.path;
                      datatxtPath = path(board.url, path(pathGuess, 'data.txt'));
                      fetch$1 = fetch();
                      response = fetch$1(datatxtPath, {
                          method: 'GET',
                          headers: boardDatatxtHeaders(board, datatxtPath)
                      });
                      if (response.then) {
                          return response.then((function ($await_42) {
                              try {
                                  response = $await_42;
                                  return $If_17.call(this);
                              } catch ($boundEx) {
                                  return $error($boundEx);
                              }
                          }).bind(this), $error);
                      }
                      function $If_17() {
                          if (response.ok) {
                              var respText, pinMetadata;
                              respText = typeof response.text === 'function' ? response.text() : response.text;
                              return new Promise(function ($return, $error) {
                                  if (respText.then) {
                                      return respText.then($return, $error);
                                  }
                                  return $return(respText);
                              }).then((function ($await_44) {
                                  try {
                                      pinMetadata = boardManifestLoad($await_44);
                                      pinMetadata.forEach(function (mtd) { return metadata = pinManifestMerge(metadata, mtd); });
                                      results.metadata = metadata;
                                      return $If_18.call(this);
                                  } catch ($boundEx) {
                                      return $error($boundEx);
                                  }
                              }).bind(this), $error);
                          }
                          function $If_18() {
                              return $If_16.call(this);
                          }
                          
                          return $If_18.call(this);
                      }
                      
                      return $If_17.call(this);
                  }
                  function $If_16() {
                      return $return(results);
                  }
                  
                  return $If_16.call(this);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }).bind(this), $error);
      });
  }

  function boardPinCreateDatatxt(board, path, name, metadata, args) {
      return new Promise(function ($return, $error) {
          var uploadFiles;
          boardVersionsCreate(board, name, path);
          uploadFiles = dir.list(path, {
              recursive: true
          });
          return datatxtUploadFiles({
              board: board,
              name: name,
              files: uploadFiles,
              path: path
          }).then(function ($await_45) {
              try {
                  return datatxtUpdateIndex({
                      board: board,
                      path: name,
                      operation: 'create',
                      name: name,
                      metadata: metadata
                  }).then(function ($await_46) {
                      try {
                          return $return();
                      } catch ($boundEx) {
                          return $error($boundEx);
                      }
                  }, $error);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }, $error);
      });
  }

  function boardPinRemoveDatatxt(board, name, args) {
      return new Promise(function ($return, $error) {
          var files, fetch$1;
          return datatxtPinFiles(board, name).then((function ($await_47) {
              try {
                  {
                      files = $await_47;
                      files.push(path(name, 'data.txt'));
                      fetch$1 = fetch();
                      var $Loop_20_trampoline, $Loop_20_local;
                      function $Loop_20_step() {
                          var ref = $Loop_20_local();
                          var i = ref[0];
                          i++;
                          return $Loop_20.bind(this, i);
                      }
                      
                      function $Loop_20(i) {
                          $Loop_20_local = function () {
                              return [i];
                          };
                          if (i < files.length) {
                              var file, deleteUrl, response;
                              file = files[i];
                              deleteUrl = path(board.url, file);
                              response = fetch$1(deleteUrl, {
                                  method: 'DELETE',
                                  headers: boardDatatxtHeaders(board, file, 'DELETE')
                              });
                              if (response.then) {
                                  return response.then((function ($await_48) {
                                      try {
                                          response = $await_48;
                                          return $If_22.call(this);
                                      } catch ($boundEx) {
                                          return $error($boundEx);
                                      }
                                  }).bind(this), $error);
                              }
                              function $If_22() {
                                  if (!response.ok) {
                                      var respText;
                                      respText = typeof response.text === 'function' ? response.text() : response.text;
                                      return new Promise(function ($return, $error) {
                                          if (respText.then) {
                                              return respText.then($return, $error);
                                          }
                                          return $return(respText);
                                      }).then((function ($await_50) {
                                          try {
                                              console.warning(("Failed to remove '" + file + "' from '" + (board.name) + "' board. Error: " + $await_50));
                                              return $If_23.call(this);
                                          } catch ($boundEx) {
                                              return $error($boundEx);
                                          }
                                      }).bind(this), $error);
                                  }
                                  function $If_23() {
                                      return $Loop_20_step;
                                  }
                                  
                                  return $If_23.call(this);
                              }
                              
                              return $If_22.call(this);
                          } else 
                              { return [1]; }
                      }
                      
                      return ($Loop_20_trampoline = (function (q) {
                          while (q) {
                              if (q.then) 
                                  { return void q.then($Loop_20_trampoline, $error); }
                              try {
                                  if (q.pop) 
                                      { if (q.length) 
                                      { return q.pop() ? $Loop_20_exit.call(this) : q; }
                                   else 
                                      { q = $Loop_20_step; } }
                                   else 
                                      { q = q.call(this); }
                              } catch (_exception) {
                                  return $error(_exception);
                              }
                          }
                      }).bind(this))($Loop_20.bind(this, 0));
                      function $Loop_20_exit() {
                          return datatxtUpdateIndex({
                              board: board,
                              path: name,
                              operation: 'remove',
                              name: name
                          }).then(function ($await_51) {
                              try {
                                  dir.remove(pinStoragePath(board, name), {
                                      recursive: true
                                  });
                                  return $return();
                              } catch ($boundEx) {
                                  return $error($boundEx);
                              }
                          }, $error);
                      }
                      
                  }
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }).bind(this), $error);
      });
  }

  function boardPinVersionsDatatxt(board, name, args) {
      return new Promise(function ($return, $error) {
          var assign, rest;

          var download, opts;
          ((assign = args, download = assign.download, download = download === void 0 ? true : download, rest = objectWithoutProperties$7( assign, ["download"] ), opts = rest));
          return datatxtRefreshManifest(board, name, download).then(function ($await_52) {
              try {
                  return $return(boardVersionsGet(board, name));
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }, $error);
      });
  }

  function objectWithoutProperties$8 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  function formatDate(date) {
      var weekDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov',
          'Dec'];
      var str = '';
      str += (weekDays[date.getUTCDay() - 1]) + ", ";
      var day = date.getUTCDate();
      if (day < 10) 
          { day = "0" + day; }
      str += day + " " + (months[date.getUTCMonth()]) + " " + (date.getUTCFullYear()) + " ";
      var hours = date.getUTCHours();
      if (hours < 10) 
          { hours = "0" + hours; }
      var minutes = date.getUTCMinutes();
      if (minutes < 10) 
          { minutes = "0" + minutes; }
      var seconds = date.getUTCSeconds();
      if (seconds < 10) 
          { seconds = "0" + seconds; }
      str += hours + ":" + minutes + ":" + seconds + " GMT";
      return str;
  }

  function s3Headers(board, verb, path$1, file) {
      var date = formatDate(new Date());
      var bucket = board.bucket;
      if (new RegExp('^https?://').test(path$1)) {
          var pathNohttp = path$1.replace(/^https?:\/\//, '');
          path$1 = pathNohttp.replace(/^[^\/]+\//, '');
          bucket = pathNohttp.replace(/[\/.].*/, '');
      }
      var content = [verb,'','application/octet-stream','',("x-amz-date:" + date),path(("/" + bucket), path$1)].join('\n');
      var sha1 = callbacks.get('sha1');
      var signature = sha1(content, board.secret || '');
      var headers = {
          Host: (bucket + "." + (board.host)),
          'x-amz-date': date,
          'Content-Type': 'application/octet-stream',
          Authorization: ("AWS " + (board.key) + ":" + signature)
      };
      return headers;
  }

  function boardInitializeS3(board, args) {
      return new Promise(function ($return, $error) {
          var assign, rest;

          var env, bucket, key, secret, cache, host, params, obj;
          env = callbacks.get('env');
          ((assign = args, bucket = assign.bucket, bucket = bucket === void 0 ? env('AWS_BUCKET') : bucket, key = assign.key, key = key === void 0 ? env('AWS_ACCESS_KEY_ID') : key, secret = assign.secret, secret = secret === void 0 ? env('AWS_SECRET_ACCESS_KEY') : secret, cache = assign.cache, host = assign.host, host = host === void 0 ? 's3.amazonaws.com' : host, rest = objectWithoutProperties$8( assign, ["bucket", "key", "secret", "cache", "host"] ), params = rest));
          board.bucket = bucket;
          if (!bucket) 
              { return $error(new Error("The 's3' board requires a 'bucket' parameter.")); }
          if (!key) 
              { return $error(new Error("The 's3' board requires a 'key' parameter.")); }
          if (!secret) 
              { return $error(new Error("The 's3' board requires a 'secret' parameter.")); }
          obj = Object.assign({}, params, {
              name: board.name,
              url: ("https://" + bucket + "." + host),
              cache: cache,
              headers: s3Headers,
              needsIndex: false,
              key: key,
              secret: secret,
              bucket: bucket,
              connect: false,
              browseUrl: ("https://s3.console.aws.amazon.com/s3/buckets/" + bucket + "/"),
              host: host
          });
          return boardInitializeDatatxt(board, obj).then(function ($await_1) {
              try {
                  return $return(board);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }, $error);
      });
  }

  function guessType(file) {
      var extension = file.split('.').pop();
      if (extension === 'txt') {
          return 'text/plain';
      }
      return '';
  }

  function objectWithoutProperties$9 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  function azureHeaders(board, verb, path, file) {
      var date = new Date().toUTCString();
      var azureVersion = '2015-04-05';
      var container = board.container;
      var account = board.account;
      if (new RegExp('^https?://').test(path)) {
          var pathNohttp = path.replace('^https?://', '');
          var subPath = pathNohttp.replace('^[^/]+/', '');
          account = pathNohttp.replace('\\..*', '');
          path = subPath.replace('^[^/]+/', '');
          container = subPath.replace('/.*', '');
      }
      var contentLength = '';
      var contentType = '';
      if (file) {
          contentLength = fileSize(file);
          contentType = guessType(file);
      }
      var content = [verb,'\n',contentLength,'',contentType,'\n\n\n\n\n','x-ms-blob-type:BlockBlob',
          ("x-ms-date:" + date),("x-ms-version:" + azureVersion),("/" + account + "/" + container + "/" + path)].join('\n');
      var sha1 = callbacks.get('sha1');
      var signature = sha1(content, board.secret || '');
      var headers = {
          'x-ms-date': date,
          'x-ms-version': azureVersion,
          'x-ms-blob-type': 'BlockBlob',
          Authorization: ("SharedKey " + account + ":" + signature)
      };
      return headers;
  }

  function boardInitializeAzure(board, args) {
      return new Promise(function ($return, $error) {
          var assign, rest;

          var env, container, account, key, cache, params, azureUrl, obj;
          env = callbacks.get('env');
          ((assign = args, container = assign.container, container = container === void 0 ? env('AZURE_STORAGE_CONTAINER') : container, account = assign.account, account = account === void 0 ? env('AZURE_STORAGE_ACCOUNT') : account, key = assign.key, key = key === void 0 ? env('AZURE_STORAGE_KEY') : key, cache = assign.cache, rest = objectWithoutProperties$9( assign, ["container", "account", "key", "cache"] ), params = rest));
          if (!container) 
              { return $error(new Error("The 'azure' board requires a 'container' parameter.")); }
          if (!account) 
              { return $error(new Error("The 'azure' board requires an 'account' parameter.")); }
          if (!key) 
              { return $error(new Error("The 'azure' board requires a 'key' parameter.")); }
          azureUrl = "https://" + account + ".blob.core.windows.net/" + container;
          obj = Object.assign({}, params, {
              name: board.name,
              url: azureUrl,
              cache: cache,
              headers: azureHeaders,
              needsIndex: false,
              container: container,
              account: account,
              key: key,
              connect: false,
              browseUrl: 'https://portal.azure.com'
          });
          return boardInitializeDatatxt(board, obj).then(function ($await_1) {
              try {
                  return $return(boardGet$1(board.name));
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }, $error);
      });
  }

  function objectWithoutProperties$a (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  function gcloudCandidates(binary) {
      var env = callbacks.get('env');
      var which = callbacks.get('which');
      var platform = callbacks.get('process')().platform;
      if (platform === 'win32') {
          var appdata = normalizePath(env('localappdata'), {
              winslash: '/'
          });
          var binaryName = binary + ".cmd";
          var sdkPath = path('Google/Cloud SDK/google-cloud-sdk/bin', binaryName);
          return [function () { return path(appdata, sdkPath); },function () { return path(env('ProgramFiles'), sdkPath); },
              function () { return path(env('ProgramFiles(x86)'), sdkPath); }];
      } else {
          var binaryName$1 = binary;
          return [function () { return which(binaryName$1); },function () { return ("~/google-cloud-sdk/bin/" + binaryName$1); },
              function () { return path(env('GCLOUD_INSTALL_PATH') || '~/google-cloud-sdk', path('bin', binaryName$1)); }];
      }
  }

  function gcloudBinary() {
      var pathEnv = callbacks.get('env')('gcloud.binary.path');
      var pathOption = callbacks.get('getOption')('gcloud.binary.path');
      var userPath = pathEnv ? pathEnv : pathOption ? pathOption : '';
      if (userPath) {
          return normalizePath(userPath);
      }
      var candidates = gcloudCandidates('gcloud');
      candidates.forEach(function (candidate) {
          if (fileExists(candidate())) {
              return normalizePath(candidate());
          }
      });
      return null;
  }

  function gcloudIndexUpdated(board) {
      return new Promise(function ($return, $error) {
          var metadata, fetch$1, response;
          metadata = {
              cacheControl: 'private, max-age=0, no-transform',
              name: 'data.txt'
          };
          fetch$1 = fetch();
          return fetch$1(("https://storage.googleapis.com/storage/v1/b/" + (board.bucket) + "./o/" + (data.txt)), Object.assign({
              method: 'PATCH',
              body: metadata
          }, boardDatatxtHeaders(board, 'o/data.txt', 'PATCH'))).then((function ($await_2) {
              try {
                  response = $await_2;
                  if (!response.ok) {
                      return response.text().then((function ($await_3) {
                          try {
                              console.warning(("Failed to update data.txt metadata: " + $await_3));
                              return $If_1.call(this);
                          } catch ($boundEx) {
                              return $error($boundEx);
                          }
                      }).bind(this), $error);
                  }
                  function $If_1() {
                      return $return();
                  }
                  
                  return $If_1.call(this);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }).bind(this), $error);
      });
  }

  function gcloudHeaders(board, verb, path, file) {
      var contentType = null;
      if (file) {
          contentType = guessType(file);
      }
      var headers = {
          Authorization: ("Bearer " + (board.token)),
          'Content-Type': contentType
      };
      return headers;
  }

  function boardInitializeGCloud(board, args) {
      return new Promise(function ($return, $error) {
          var assign, rest;

          var env, bucket, token, cache, params, gcloudUrl, obj;
          env = callbacks.get('env');
          ((assign = args, bucket = assign.bucket, bucket = bucket === void 0 ? env('GCLOUD_STORAGE_BUCKET') : bucket, token = assign.token, token = token === void 0 ? env('GOOGLE_STORAGE_ACCESS_TOKEN') : token, cache = assign.cache, rest = objectWithoutProperties$a( assign, ["bucket", "token", "cache"] ), params = rest));
          if (!bucket) 
              { return $error(new Error("Board 'gcloud' requires a 'bucket' parameter.")); }
          if (!token) {
              var gcloud;
              gcloud = gcloudBinary();
              if (gcloud) {
                  token = callbacks.get('exec')((gcloud + " 'auth', 'print-access-token'"));
              } else {
                  return $error(new Error("Board 'gcloud' requires an 'access' parameter with a Google Cloud Access Token."));
              }
          }
          gcloudUrl = "https://storage.googleapis.com/" + bucket;
          obj = Object.assign({}, params, {
              name: board.name,
              url: gcloudUrl,
              headers: gcloudHeaders,
              cache: cache,
              bucket: bucket,
              token: token,
              browse_url: ("https://console.cloud.google.com/storage/browser/" + bucket),
              indexRandomize: true,
              indexUpdated: gcloudIndexUpdated
          });
          return boardInitializeDatatxt(board, obj).then(function ($await_4) {
              try {
                  return $return(boardGet(board.name));
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }, $error);
      });
  }

  function objectWithoutProperties$b (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  function dospacesHeaders(board, verb, path$1, file) {
      var date = new Date().toUTCString();
      var space = board.space || '';
      if (new RegExp('^https?://').test(path$1)) {
          var pathNohttp = path$1$1.replace('^https?://', '');
          var path$1$1 = pathNohttp.replace('^[^/]+/', '');
          space = pathNohttp.replace('\\..*', '');
      }
      var content = [verb,'','application/octet-stream',date,path(space, path$1)].join('\n');
      var sha1 = callbacks.get('sha1');
      var signature = sha1(content, board.secret || '');
      var headers = {
          Host: (space + "." + (board.datacenter) + "." + (board.host)),
          Date: date,
          'Content-Type': 'application/octet-stream',
          Authorization: ("AWS " + (board.key) + ":" + signature)
      };
      return headers;
  }

  function boardInitializeDospaces(board, args) {
      return new Promise(function ($return, $error) {
          var assign, rest;

          var env, space, key, secret, datacenter, cache, host, params, dospacesUrl, obj;
          env = callbacks.get('env');
          ((assign = args, space = assign.space, space = space === void 0 ? env('DO_SPACE') : space, key = assign.key, key = key === void 0 ? env('DO_ACCESS_KEY_ID') : key, secret = assign.secret, secret = secret === void 0 ? env('DO_SECRET_ACCESS_KEY') : secret, datacenter = assign.datacenter, datacenter = datacenter === void 0 ? env('DO_DATACENTER') : datacenter, cache = assign.cache, host = assign.host, host = host === void 0 ? 'digitaloceanspaces.com' : host, rest = objectWithoutProperties$b( assign, ["space", "key", "secret", "datacenter", "cache", "host"] ), params = rest));
          if (!space) 
              { return $error(new Error("The 'dospace' board requires a 'space' parameter.")); }
          if (!key) 
              { return $error(new Error("The 'dospace' board requires a 'key' parameter.")); }
          if (!secret) 
              { return $error(new Error("The 'dospace' board requires a 'secret' parameter.")); }
          if (!datacenter) 
              { return $error(new Error("The 'dospace' board requires a 'datacenter' parameter.")); }
          board.space = space;
          dospacesUrl = "https://" + (board.space) + "." + datacenter + "." + host;
          obj = Object.assign({}, params, {
              name: board.name,
              url: dospacesUrl,
              cache: cache,
              headers: dospacesHeaders,
              key: key,
              secret: secret,
              space: space,
              datacenter: datacenter,
              browseUrl: ("https://cloud.digitalocean.com/spaces/" + space),
              host: host
          });
          return boardInitializeDatatxt(board, obj).then(function ($await_1) {
              try {
                  return $return(boardGet(board.name));
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }, $error);
      });
  }

  function getFunction(name, packageName) {
      return get('getFunction')(name, packageName);
  }

  var rsconnectTokenDependencies = function () { return ({
      accounts: getFunction('accounts', 'rsconnect'),
      accountInfo: getFunction('accountInfo', 'rsconnect'),
      serverInfo: getFunction('serverInfo', 'rsconnect'),
      signatureHeaders: getFunction('signatureHeaders', 'rsconnect'),
      httpFunction: getFunction('httpFunction', 'rsconnect')
  }); };
  var rsconnectTokenParseUrl = function (urlText) {
      var components = urlText.match(/(http|https):\/\/([^:/#?]+)(?::(\\d+))?(.*)/i);
      if (components.length === 0) 
          { throw new Error(("Invalid url: " + urlText)); }
      return {
          protocol: components[2],
          host: components[3],
          port: components[4],
          path: components[5],
          pathSansApi: url.path.replace('/__api__', '')
      };
  };
  function rsconnectUrlFromPath(board, path) {
      var deps = rsconnectTokenDependencies();
      var serverInfo = deps.serverInfo(board.serverName);
      var service = rsconnectTokenParseUrl(serverInfo.url);
      return ("" + (service.pathSansApi) + path);
  }

  function rsconnectTokenInitialize(board) {
      var deps = rsconnectTokenDependencies();
      if (!deps.accounts) {
          throw new Error("RStudio Connect is not registered, please install the 'rsconnect' package or specify an API key.");
      }
      var accounts = deps.accounts();
      if (!accounts) {
          throw new Error('RStudio Connect is not registered, please add a publishing account or specify an API key.');
      }
      if (!board.server) {
          board.serverName = accounts.server[1];
      }
      if (!board.account) {
          board.account = accounts[accounts.server === board.serverName].name;
      }
      if (board.account.length !== 1) {
          throw new Error(("Multiple accounts (" + (board.account.join(', ')) + ") are associated to this server, please specify the correct account parameter in board_register()."));
      }
      board.server = deps.serverInfo(board.serverName).url.replace('/__api__', '');
      return board;
  }

  function rsconnectApiAuthHeaders(board, path, verb, content) {
      var headers = {};
      if (rsconnectApiAuth(board)) {
          headers.Authorization = "Key " + (board.key);
      } else {
          headers = rsconnectTokenHeaders(board, rsconnectUrlFromPath(board, path), verb, content);
      }
      if (!content || typeof content !== 'string') {
          headers['Content-Type'] = 'application/json';
      } else {
          headers['Content-Type'] = 'multipart/form-data';
          headers['X-Content-Checksum'] = md5(content);
      }
      return headers;
  }

  function rsconnectApiGet(board, path) {
      return new Promise(function ($return, $error) {
          var url, fetch$1, headers, result, jsonResult;
          url = "" + (board.server) + path;
          fetch$1 = fetch();
          headers = rsconnectApiAuthHeaders(board, path, 'GET');
          result = fetch$1(url, {
              method: 'GET',
              headers: headers
          });
          if (result.then) {
              return result.then((function ($await_15) {
                  try {
                      result = $await_15;
                      return $If_5.call(this);
                  } catch ($boundEx) {
                      return $error($boundEx);
                  }
              }).bind(this), $error);
          }
          function $If_5() {
              if (!result.ok) {
                  var textResult;
                  textResult = typeof result.text === 'function' ? result.text() : result.text;
                  return new Promise(function ($return, $error) {
                      if (textResult.then) {
                          return textResult.then($return, $error);
                      }
                      return $return(textResult);
                  }).then(function ($await_17) {
                      try {
                          return $error(new Error(("Failed to retrieve " + url + ": " + $await_17)));
                      } catch ($boundEx) {
                          return $error($boundEx);
                      }
                  }, $error);
              }
              jsonResult = result.json();
              return new Promise(function ($return, $error) {
                  if (jsonResult.then) {
                      return jsonResult.then($return, $error);
                  }
                  return $return(jsonResult);
              }).then($return, $error);
          }
          
          return $If_5.call(this);
      });
  }

  var rsconnectApiPost = function (board, path, content, progress) { return new Promise(function ($return, $error) {
      var url, body, fetch$1, headers;
      url = "" + (board.server) + path;
      body = '';
      if (typeof content === 'string') {
          content = read(content, '');
          body = content;
      } else {
          body = JSON.stringify(content).replace(/,/g, ',\n').replace(/{/g, '{\n').replace(/}/g, '\n}');
      }
      fetch$1 = fetch();
      headers = rsconnectApiAuthHeaders(board, url, 'POST', content);
      if (rsconnectApiAuth(board)) {
          var result, jsonResult;
          result = fetch$1(url, {
              method: 'POST',
              headers: headers,
              body: body
          });
          if (result.then) {
              return result.then((function ($await_20) {
                  try {
                      result = $await_20;
                      return $If_10.call(this);
                  } catch ($boundEx) {
                      return $error($boundEx);
                  }
              }).bind(this), $error);
          }
          function $If_10() {
              if (!result.ok) {
                  var textResult;
                  textResult = typeof result.text === 'function' ? result.text() : result.text;
                  return new Promise(function ($return, $error) {
                      if (textResult.then) {
                          return textResult.then($return, $error);
                      }
                      return $return(textResult);
                  }).then(function ($await_22) {
                      try {
                          return $return({
                              error: ("Operation failed with status: " + $await_22)
                          });
                      } catch ($boundEx) {
                          return $error($boundEx);
                      }
                  }, $error);
              }
              jsonResult = result.json();
              return new Promise(function ($return, $error) {
                  if (jsonResult.then) {
                      return jsonResult.then($return, $error);
                  }
                  return $return(jsonResult);
              }).then($return, $error);
          }
          
          return $If_10.call(this);
      } else {
          rsconnectTokenPost(board, path, content, encode);
          return $If_9.call(this);
      }
      function $If_9() {
          return $return();
      }
  }); };
  var rsconnectApiDelete = function (board, path) { return new Promise(function ($return, $error) {
      var url, fetch$1, headers, result;
      url = "" + (board.server) + path;
      fetch$1 = fetch();
      headers = rsconnectApiAuthHeaders(board, path, 'DELETE');
      result = fetch$1(url, {
          method: 'DELETE',
          headers: headers
      });
      if (result.then) {
          return result.then((function ($await_25) {
              try {
                  result = $await_25;
                  return $If_14.call(this);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }).bind(this), $error);
      }
      function $If_14() {
          if (!result.ok) {
              return $error(new Error(("Failed to delete " + path + ": " + testResult)));
          }
          return $return();
      }
      
      return $If_14.call(this);
  }); };
  var rsconnectApiDownload = function (board, name, path, etag) { return new Promise(function ($return, $error) {
      var url, headers;
      url = path.indexOf(board.server) === 0 ? path : ("" + (board.server) + path);
      headers = rsconnectApiAuthHeaders(board, path, 'GET');
      return pinDownload(url, {
          name: name,
          component: board,
          headers: headers,
          customEtag: etag
      }).then($return, $error);
  }); };
  var rsconnectApiAuth = function (board) { return !(!board.key); };
  function rsconnectApiVersion(board) {
      return new Promise(function ($return, $error) {
          var version;
          return rsconnectApiGet(board, '/__api__/server_settings').then(function ($await_27) {
              var assign;

              try {
                  ((assign = $await_27, version = assign.version));
                  return $return(version);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }, $error);
      });
  }

  var boardMetadataToText = function (metadata, text) {
      if (typeof text !== 'string') {
          text = '';
      }
      var trimmed = text.trim();
      var spacer = null;
      if (!trimmed.legth) {
          spacer = '';
      } else if (trimmed[trimmed.length - 1] === '.') {
          spacer = ' ';
      } else {
          spacer = '. ';
      }
      if (metadata.type === 'table') {
          return ("" + text + spacer + "A table pin with " + (metadata.rows) + " rows and " + (metadata.cols) + " columns.");
      } else if (metadata.type === 'files') {
          return ("" + text + spacer + "A files pin with " + (metadata.extension) + " extension.");
      }
      return text;
  };
  var boardMetadataFromText = function (text) {
      if (!text) {
          text = '';
      }
      var patterns = {
          table: {
              regex: 'A table pin with ([0-9]+) rows and ([0-9]+) columns',
              metadata: function (match) { return ({
                  type: 'table',
                  rows: parseInt(match[1]),
                  cols: parseInt(match[2])
              }); }
          },
          files: {
              regex: 'A files pin with ([a-z]+) extension',
              metadata: function (match) { return ({
                  type: 'files',
                  extension: match[1]
              }); }
          }
      };
      Object.keys(patterns).forEach(function (key) {
          var pattern = patterns[key];
          if (new RegExp(pattern.regex).test(text)) {
              var matches = new RegExp(pattern.regex).exec(text);
              return pattern.metadata(matches);
          }
      });
      return {};
  };
  var boardMetadataRemove = function (text) { return text.replace(/A (table|tiles) pin with .*/, ''); };

  var addUserHtml = function (dir, path$1) {
      if ( path$1 === void 0 ) path$1 = getOption('RSCONNECT_HTML_PATH', '');

      if (path$1) {
          copy(path$1, path(dir, 'index.html'), {
              overwrite: true
          });
      }
  };
  var rsconnectBundleTemplateHtml = function (tempDir, template, value) {
      var htmlFile = path(tempDir, 'index.html');
      var htmlIndex = '';
      htmlIndex = read(htmlFile);
      value = value.replace('\\n', '\\\\n');
      htmlIndex = htmlIndex.replace(("{{" + template + "}}"), value);
      write(htmlIndex, htmlFile);
  };
  var rsconnectBundleFilesHtml = function (files) {
      var html = '';
      files.forEach(function (file) {
          html = html + " <a href=\"" + file + "\">" + file + "</a> ";
      });
      return html;
  };
  var rsconnectBundleTemplateCommon = function (tempDir, style, name, board, accountName, retrieveCommand) {
      rsconnectBundleTemplateHtml(tempDir, 'data_preview_style', style);
      rsconnectBundleTemplateHtml(tempDir, 'pin_name', name);
      if (typeof board.server === 'string') {
          rsconnectBundleTemplateHtml(tempDir, 'server_name', board.server);
      } else {
          rsconnectBundleTemplateHtml(tempDir, 'server_name', 'https://rstudio-connect-server');
      }
      rsconnectBundleTemplateHtml(tempDir, 'account_name', accountName);
      if (!retrieveCommand) {
          retrieveCommand = "pin_get(\"" + accountName + "/" + name + "\", board = \"rsconnect\")";
      }
      rsconnectBundleTemplateHtml(tempDir, 'retrieve_pin', retrieveCommand);
  };
  var rsconnectBundleCreateDefault = function (x, tempDir, name, board, accountName, retrieveCommand) {
      var htmlFile = path(tempDir, 'index.html');
      callbacks.get('saveRDS')(x, path(tempDir, 'data.rds'), {
          version: 2
      });
      var files = dir.list(tempDir, {
          recursive: true
      });
      files = files.filter(function (f) { return !new RegExp('index\\.html').test(f); });
      copy(dir.list('../data', {
          fullNames: true
      }), tempDir, {
          recursive: true
      });
      addUserHtml(tempDir);
      rsconnectBundleTemplateHtml(tempDir, 'files_html', rsconnectBundleFilesHtml(files));
      rsconnectBundleTemplateHtml(tempDir, 'data_preview', '{"data": [], "columns": []}');
      rsconnectBundleTemplateCommon(tempDir, 'display: none', name, board, accountName, retrieveCommand);
      return 'data.rds';
  };
  var rsconnectBundleCreateDataFrame = function (x, tempDir, name, board, accountName, retrieveCommand) {
      copy(dir.list('../data', {
          fullNames: true
      }), tempDir, {
          recursive: true
      });
      addUserHtml(tempDir);
      var maxRows = Math.min(x.length, getOption('pins.preview.rows', 10 ^ 4));
      var csvName = dir.list(tempDir, 'data\\.csv');
      var xPreview = x.length ? x.slice(0, 6) : [];
      xPreview = dataFrame(xPreview.map(function (x) {
          if (typeof x !== 'number') {
              var charColumn = x.toString();
              return charColumn.length === xPreview.length ? charColumn : '...'.repeat(xPreview.length);
          } else {
              return x;
          }
      }));
      var dataPreview = {
          columns: xPreview[0].map(function (x) { return ({
              align: 'right',
              label: x,
              name: x,
              type: ''
          }); }),
          data: xPreview,
          options: {
              columns: {
                  max: 10
              },
              rows: {
                  min: 1,
                  total: xPreview.length
              }
          }
      };
      rsconnectBundleTemplateHtml(tempDir, 'files_html', rsconnectBundleFilesHtml(csvName));
      rsconnectBundleTemplateHtml(tempDir, 'data_preview', JSON.stringify(dataPreview));
      rsconnectBundleTemplateCommon(tempDir, '', name, board, accountName, retrieveCommand);
      return 'data.rds';
  };
  var rsconnectBundleCreateString = function (x, tempDir, name, board, accountName, retrieveCommand) {
      copy(dir.list(x, {
          fullNames: true
      }), tempDir, {
          recursive: true
      });
      var dataFiles = dir.list(tempDir, {
          recursive: true
      });
      var htmlFile = path(tempDir, 'index.html');
      var files = dir.list(tempDir, {
          recursive: true
      });
      files = files.filter(function (f) { return !new RegExp('index\\.html').test(f); });
      copy(dir.list('../data', {
          fullNames: true
      }), tempDir, {
          recursive: true
      });
      addUserHtml(tempDir);
      rsconnectBundleTemplateHtml(tempDir, 'files_html', rsconnectBundleFilesHtml(files));
      rsconnectBundleTemplateHtml(tempDir, 'data_preview', '{"data": [], "columns": []}');
      rsconnectBundleTemplateCommon(tempDir, 'display: none', name, board, accountName, retrieveCommand);
      return dataFiles;
  };
  var rsconnectBundleCreate = function (x) {
      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

      return useMethod.apply(void 0, [ 'rsconnectBundleCreate', x ].concat( args ));
  };
  var rsconnectBundleCompress = function (path$1, manifest) { return new Promise(function ($return, $error) {
      var manifestJson, bundlePath, resultPath;
      manifestJson = JSON.stringify(manifest);
      bundlePath = 'temp/rsconnect-bundle.tar.gz';
      write(manifestJson, path(path$1, 'manifest.json'));
      resultPath = dir.zip(path$1, bundlePath);
      if (resultPath.then) {
          return resultPath.then((function ($await_2) {
              try {
                  resultPath = $await_2;
                  return $If_1.call(this);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }).bind(this), $error);
      }
      function $If_1() {
          return $return(resultPath || bundlePath);
      }
      
      return $If_1.call(this);
  }); };
  var rsconnectBundleFileMd5 = function (path) {
      var fileData = read(path);
      return md5(fileData);
  };

  function objectWithoutProperties$c (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  var rsconnectDependencies = function () { return ({
      outputMetadata: getFunction('output_metadata', 'rmarkdown')
  }); };
  function rsconnectPinsSupported(board) {
      return new Promise(function ($return, $error) {
          var version;
          return rsconnectApiVersion(board).then(function ($await_16) {
              try {
                  version = $await_16;
                  return $return(version > '1.7.7');
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }, $error);
      });
  }

  var rsconnectGetByName = function (board, name) { return new Promise(function ($return, $error) {
      var onlyName, details;
      onlyName = pinContentName(name);
      return boardPinFindRSConnect(board, onlyName, {
          name: name
      }).then(function ($await_17) {
          try {
              details = $await_17;
              if (details.length > 1) {
                  var ownerDetails;
                  ownerDetails = details[details.ownerUsername === board.account];
                  if (ownerDetails.length === 1) {
                      details = ownerDetails;
                  } else {
                      var names;
                      names = details.map(function (d) { return d.name; }).join("', '");
                      return $error(new Error(("Multiple pins named '" + name + "' in board '" + (board.name) + "', choose from: '" + names + "'.")));
                  }
              }
              details = details.length === 1 ? details[0] : details;
              details = pinResultsExtractColumn(details, 'content_category');
              details = pinResultsExtractColumn(details, 'url');
              details = pinResultsExtractColumn(details, 'guid');
              return $return(details);
          } catch ($boundEx) {
              return $error($boundEx);
          }
      }, $error);
  }); };
  var rsconnectWaitByName = function (board, name) { return new Promise(function ($return, $error) {
      var maxWaitTime, waitTime, value;
      maxWaitTime = getOption('pins.rsconnect.wait', 5);
      waitTime = 0;
      return rsconnectGetByName(board, name).then((function ($await_18) {
          try {
              {
                  value = $await_18;
                  var $Loop_3_trampoline;
                  function $Loop_3() {
                      if (!value && waitTime < maxWaitTime) {
                          waitTime += 1;
                          return rsconnectGetByName(board, name).then(function ($await_19) {
                              try {
                                  value = $await_19;
                                  return $Loop_3;
                              } catch ($boundEx) {
                                  return $error($boundEx);
                              }
                          }, $error);
                      } else 
                          { return [1]; }
                  }
                  
                  return ($Loop_3_trampoline = (function (q) {
                      while (q) {
                          if (q.then) 
                              { return void q.then($Loop_3_trampoline, $error); }
                          try {
                              if (q.pop) 
                                  { if (q.length) 
                                  { return q.pop() ? $Loop_3_exit.call(this) : q; }
                               else 
                                  { q = $Loop_3; } }
                               else 
                                  { q = q.call(this); }
                          } catch (_exception) {
                              return $error(_exception);
                          }
                      }
                  }).bind(this))($Loop_3);
                  function $Loop_3_exit() {
                      return $return();
                  }
                  
              }
          } catch ($boundEx) {
              return $error($boundEx);
          }
      }).bind(this), $error);
  }); };
  var rsconnectRemotePathFromUrl = function (board, url) {
      url = url.replace('^https?://', '');
      var server = board.server.replace('^https?://', '');
      url = url.replace(("^.*" + server), '');
      return url.replace('/$', '');
  };
  function boardInitializeRSConnect(board, args) {
      return new Promise(function ($return, $error) {
          var env, envvarKey, envvarServer;
          env = callbacks.get('env');
          envvarKey = env('CONNECT_API_KEY') || env('RSCONNECT_API');
          if (!args.key && envvarKey) {
              args.key = envvarKey;
          }
          envvarServer = env('CONNECT_SERVER') || env('RSCONNECT_SERVER');
          if (!args.server && envvarServer) {
              args.server = envvarServer;
          }
          if (args.server) {
              board.server = args.server.replace('/$', '');
              board.serverName = args.server.replace('https?://|(:[0-9]+)?/.*', '');
          }
          board.account = args.account;
          board.outputFiles = args.outputFiles;
          if (!args.key) {
              return $error(new Error('Invalid API key, the API key is empty.'));
          }
          board.key = args.key;
          if (board.key && !board.server) {
              return $error(new Error("Please specify the 'server' parameter when using API keys."));
          }
          if (!rsconnectApiAuth(board) && !board.outputFiles) {
              board = rsconnectTokenInitialize(board);
          }
          var $Try_1_Post = function () {
              try {
                  if (!board.account) {
                      var username;
                      return rsconnectApiGet(board, '/__api__/users/current/').then((function ($await_20) {
                          var assign;

                          try {
                              ((assign = $await_20, username = assign.username));
                              board.account = username;
                              return $If_5.call(this);
                          } catch ($boundEx) {
                              return $error($boundEx);
                          }
                      }).bind(this), $error);
                  }
                  function $If_5() {
                      return $return(board);
                  }
                  
                  return $If_5.call(this);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          };
          var $Try_1_Catch = function (_) {
              try {
                  board.pinsSupported = false;
                  return $Try_1_Post();
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          };
          try {
              return rsconnectPinsSupported(board).then(function ($await_21) {
                  try {
                      board.pinsSupported = $await_21;
                      return $Try_1_Post();
                  } catch ($boundEx) {
                      return $Try_1_Catch($boundEx);
                  }
              }, $Try_1_Catch);
          } catch (_) {
              $Try_1_Catch();
          }
      });
  }

  function boardPinCreateRSConnect(board, path$1, name, metadata, args) {
      return new Promise(function ($return, $error) {
          var assign, rest;

          var code, dots, accessType, tempDir, xPath, x, nameQualified, accountName, dataFiles;
          ((assign = args, code = assign.code, rest = objectWithoutProperties$c( assign, ["code"] ), dots = rest));
          accessType = dots.accessType;
          if (accessType) {
              var valid;
              valid = ['acl','logged_in','all'].includes(accessType);
              if (!valid) {
                  accessType = null;
              }
          }
          tempDir = path(tempfile(), name);
          dir.create(tempDir, {
              recursive: true
          });
          xPath = dirname(path$1);
          x = xPath === 'data.rds' ? callbacks.get('readRDS')() : path$1;
          nameQualified = '';
          accountName = '';
          if (new RegExp('/').test(name)) {
              nameQualified = name;
              name = nameQualified.replace('.*/', '');
              accountName = nameQualified.replace('/.*', '');
              if (new RegExp('/').test(name) || new RegExp('/').test(accountName)) {
                  return $error(new Error('Pin names must follow the user/name convention.'));
              }
          } else {
              nameQualified = (board.account) + "/" + name;
              accountName = board.account;
          }
          if (board.outputFiles) {
              accountName = 'https://rstudio-connect-server/content/app-id';
          }
          copy(dirname(path$1), tempDir);
          dataFiles = null;
          try {
              dataFiles = rsconnectBundleCreate(x, tempDir, name, board, accountName, code);
          } catch (_) {}
          if (!dataFiles) {
              pinLog('Falied to create preview files for pin.');
              dir.remove(tempDir, {
                  recursive: true
              });
              dir.create(tempDir, {
                  recursive: true
              });
              copy(dirname(path$1), tempDir);
              dataFiles = rsconnectBundleCreateDefault(x, tempDir, name, board, accountName);
          }
          if (board.outputFiles) {
              var deps;
              deps = rsconnectDependencies();
              var knitPinDir;
              knitPinDir = path(name);
              copy(tempDir, '/', {
                  recursive: true
              });
              deps.outputMetadata.set({
                  rscOutputFiles: path(knitPinDir, dirname(knitPinDir))
              });
              return $If_6.call(this);
          } else {
              var existing, content, guid, previousVersions, description, files, manifest, bundle, upload, result;
              return rsconnectGetByName(board, nameQualified).then((function ($await_22) {
                  try {
                      existing = $await_22;
                      content = {};
                      guid = null;
                      previousVersions = null;
                      description = boardMetadataToText(metadata, metadata.description);
                      if (!existing || !existing.guid) {
                          var content$1;
                          return rsconnectApiPost(board, '/__api__/v1/experimental/content', {
                              app_mode: 'static',
                              content_category: 'pin',
                              name: name,
                              description: description
                          }).then((function ($await_23) {
                              try {
                                  content$1 = $await_23;
                                  if (content$1.error) {
                                      pinLog(("Failed to create pin with name '" + name + "."));
                                      return $error(new Error(("Failed to create pin: " + (content$1.error))));
                                  }
                                  guid = content$1.guid;
                                  return $If_7.call(this);
                              } catch ($boundEx) {
                                  return $error($boundEx);
                              }
                          }).bind(this), $error);
                      } else {
                          guid = existing.guid;
                          if (!boardVersionsEnabled(board, true)) {
                              previousVersions = boardPinVersionsRSConnect(board, nameQualified);
                          }
                          return rsconnectApiPost(board, ("/__api__/v1/experimental/content/" + guid), {
                              app_mode: 'static',
                              content_category: 'pin',
                              name: name,
                              description: description,
                              access_type: accessType
                          }).then((function ($await_24) {
                              try {
                                  content = $await_24;
                                  if (content.error) {
                                      pinLog(("Failed to update pin with GUID '" + guid + "' and name '" + name + "'."));
                                      return $error(new Error(("Failed to create pin " + (content.error))));
                                  }
                                  return $If_7.call(this);
                              } catch ($boundEx) {
                                  return $error($boundEx);
                              }
                          }).bind(this), $error);
                      }
                      function $If_7() {
                          files = dir.list(tempDir, {
                              recursive: true,
                              fullNames: true
                          }).map(function (path) { return ({
                              checksum: rsconnectBundleFileMd5(path)
                          }); });
                          manifest = {
                              version: 1,
                              locale: 'en_US',
                              platform: '3.5.1',
                              metadata: {
                                  appmode: 'static',
                                  primary_rmd: null,
                                  primary_html: 'index.html',
                                  content_category: 'pin',
                                  has_parameters: false
                              },
                              packages: null,
                              files: files,
                              users: null
                          };
                          return rsconnectBundleCompress(tempDir, manifest).then((function ($await_25) {
                              try {
                                  bundle = $await_25;
                                  return rsconnectApiPost(board, ("/__api__/v1/experimental/content/" + guid + "/upload"), normalizePath(bundle)).then((function ($await_26) {
                                      try {
                                          upload = $await_26;
                                          if (upload.error) {
                                              return $error(new Error(("Failed to upload pin " + (upload.error))));
                                          }
                                          return rsconnectApiPost(board, ("/__api__/v1/experimental/content/" + guid + "/deploy"), {
                                              bundle_id: upload.bundleId
                                          }).then((function ($await_27) {
                                              try {
                                                  result = $await_27;
                                                  if (result.error) {
                                                      return $error(new Error(("Failed to activate pin " + (result.error))));
                                                  }
                                                  return rsconnectWaitByName(board, nameQualified).then((function ($await_28) {
                                                      try {
                                                          if (!boardVersionsEnabled(board, true) && previousVersions) {
                                                              var $Loop_9_trampoline, $Loop_9_local;
                                                              function $Loop_9_step() {
                                                                  var ref = $Loop_9_local();
                                                                  var idx = ref[0];
                                                                  idx++;
                                                                  return $Loop_9.bind(this, idx);
                                                              }
                                                              
                                                              function $Loop_9(idx) {
                                                                  $Loop_9_local = function () {
                                                                      return [idx];
                                                                  };
                                                                  if (idx < previousVersions.length) {
                                                                      var deleteVersion, deletePath;
                                                                      deleteVersion = previousVersions[idx];
                                                                      deletePath = "/__api__/v1/experimental/bundles/" + (deleteVersion.version);
                                                                      pinLog(("Deleting previous version " + deletePath + "."));
                                                                      return rsconnectApiDelete(board, deletePath).then(function ($await_29) {
                                                                          try {
                                                                              return $Loop_9_step;
                                                                          } catch ($boundEx) {
                                                                              return $error($boundEx);
                                                                          }
                                                                      }, $error);
                                                                  } else 
                                                                      { return [1]; }
                                                              }
                                                              
                                                              return ($Loop_9_trampoline = (function (q) {
                                                                  while (q) {
                                                                      if (q.then) 
                                                                          { return void q.then($Loop_9_trampoline, $error); }
                                                                      try {
                                                                          if (q.pop) 
                                                                              { if (q.length) 
                                                                              { return q.pop() ? $Loop_9_exit.call(this) : q; }
                                                                           else 
                                                                              { q = $Loop_9_step; } }
                                                                           else 
                                                                              { q = q.call(this); }
                                                                      } catch (_exception) {
                                                                          return $error(_exception);
                                                                      }
                                                                  }
                                                              }).bind(this))($Loop_9.bind(this, 1));
                                                              function $Loop_9_exit() {
                                                                  return $If_8.call(this);
                                                              }
                                                              
                                                          }
                                                          function $If_8() {
                                                              dir.remove(tempDir, {
                                                                  recursive: true
                                                              });
                                                              return $return(result);
                                                          }
                                                          
                                                          return $If_8.call(this);
                                                      } catch ($boundEx) {
                                                          return $error($boundEx);
                                                      }
                                                  }).bind(this), $error);
                                              } catch ($boundEx) {
                                                  return $error($boundEx);
                                              }
                                          }).bind(this), $error);
                                      } catch ($boundEx) {
                                          return $error($boundEx);
                                      }
                                  }).bind(this), $error);
                              } catch ($boundEx) {
                                  return $error($boundEx);
                              }
                          }).bind(this), $error);
                      }
                      
                  } catch ($boundEx) {
                      return $error($boundEx);
                  }
              }).bind(this), $error);
          }
          function $If_6() {
              return $return();
          }
      });
  }

  var boardPinFindRSConnect = function (board, text, args) {
      if ( text === void 0 ) text = '';

      return new Promise(function ($return, $error) {
      var assign;

      var name, allContent, extended, metadata, filter, contentFilter, entries, results;
      ((assign = args, name = assign.name, allContent = assign.allContent, allContent = allContent === void 0 ? false : allContent, extended = assign.extended, extended = extended === void 0 ? false : extended, metadata = assign.metadata, metadata = metadata === void 0 ? false : metadata));
      if (name) {
          text = pinContentName(name);
      }
      filter = "search=" + text;
      contentFilter = '';
      if (board.pinsSupported) {
          contentFilter = 'filter=content_type:pin&';
      }
      return rsconnectApiGet(board, ("/__api__/applications/?" + contentFilter + (encodeURI(filter)))).then((function ($await_30) {
          try {
              entries = $await_30.applications;
              if (!allContent) {
                  entries = entries.filter(function (e) { return e.content_category === 'pin'; });
              }
              entries = entries.map(function (e) {
                  e.name = (e.owner_username) + "/" + (e.name);
                  return e;
              });
              if (name) {
                  var namePattern;
                  namePattern = new RegExp('/').test(name) ? ("^" + name + "$") : (".*" + name + "$");
                  entries = entries.filter(function (e) { return new RegExp(namePattern).test(e.name); });
              }
              results = pinResultsFromRows(entries);
              if (!results.length) {
                  return $return(boardEmptyResults());
              }
              results.forEach(function (r) {
                  r.type = boardMetadataFromText(r.description).type || 'files';
                  if (metadata) {
                      r.metadata = boardMetadataFromText(r.description);
                  }
                  r.description = boardMetadataRemove(r.description);
              });
              if (entries.length === 1) {
                  var manifest;
                  manifest = {};
                  if (metadata) {
                      var remotePath, etag, localPath;
                      remotePath = rsconnectRemotePathFromUrl(board, entries[0].url);
                      etag = entries[0].last_deployed_time;
                      return rsconnectApiDownload(board, entries[0].name, path(remotePath, 'data.txt'), etag).then((function ($await_31) {
                          try {
                              localPath = $await_31;
                              manifest = pinManifestGet(localPath);
                              return $If_12.call(this);
                          } catch ($boundEx) {
                              return $error($boundEx);
                          }
                      }).bind(this), $error);
                  }
                  function $If_12() {
                      if (extended) {
                          manifest = [entries[0],manifest];
                      }
                      results[0].type = manifest.type;
                      if (metadata) {
                          results[0].metadata = manifest;
                      }
                      return $If_11.call(this);
                  }
                  
                  return $If_12.call(this);
              }
              function $If_11() {
                  return $return(results);
              }
              
              return $If_11.call(this);
          } catch ($boundEx) {
              return $error($boundEx);
          }
      }).bind(this), $error);
  });
  };
  var boardPinGetRSConnect = function (board, name, ref) {
      var rest = objectWithoutProperties$c( ref, [] );
      var args = rest;

      return new Promise(function ($return, $error) {
      var assign;

      var version, url, etag, remotePath, downloadName, localPath, manifestPaths, toDelete;
      ((assign = args, version = assign.version));
      url = name;
      if (board.outputFiles) {
          return $return(name);
      }
      etag = '';
      if (!new RegExp('^http://|^https://|^/content/').test(name)) {
          var details;
          return rsconnectGetByName(board, name).then((function ($await_32) {
              try {
                  details = $await_32;
                  if (!details) {
                      return $error(new Error(("The pin '" + name + "' is not available in the '" + (board.name) + "' board.")));
                  }
                  url = details.url || details.metadata.url;
                  name = details.name;
                  etag = details.metadata.last_deployed_time;
                  return $If_13.call(this);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }).bind(this), $error);
      }
      function $If_13() {
          remotePath = rsconnectRemotePathFromUrl(board, url);
          downloadName = name;
          if (version) {
              remotePath = remotePath + "/_rev" + version;
              downloadName = path(name, path(pinVersionsPathName(), version));
          }
          return rsconnectApiDownload(board, downloadName, path(remotePath, 'data.txt'), etag).then((function ($await_33) {
              try {
                  {
                      localPath = $await_33;
                      manifestPaths = pinManifestDownload(localPath) || [];
                      var $Loop_14_trampoline, $Loop_14_local;
                      function $Loop_14_step() {
                          var ref = $Loop_14_local();
                          var i = ref[0];
                          i++;
                          return $Loop_14.bind(this, i);
                      }
                      
                      function $Loop_14(i) {
                          $Loop_14_local = function () {
                              return [i];
                          };
                          if (i < manifestPaths.length) {
                              return rsconnectApiDownload(board, downloadName, path(remotePath, manifestPaths[i]), etag).then(function ($await_34) {
                                  try {
                                      return $Loop_14_step;
                                  } catch ($boundEx) {
                                      return $error($boundEx);
                                  }
                              }, $error);
                          } else 
                              { return [1]; }
                      }
                      
                      return ($Loop_14_trampoline = (function (q) {
                          while (q) {
                              if (q.then) 
                                  { return void q.then($Loop_14_trampoline, $error); }
                              try {
                                  if (q.pop) 
                                      { if (q.length) 
                                      { return q.pop() ? $Loop_14_exit.call(this) : q; }
                                   else 
                                      { q = $Loop_14_step; } }
                                   else 
                                      { q = q.call(this); }
                              } catch (_exception) {
                                  return $error(_exception);
                              }
                          }
                      }).bind(this))($Loop_14.bind(this, 0));
                      function $Loop_14_exit() {
                          toDelete = dir.list(localPath, {
                              fullNames: true
                          }).filter(function (f) { return new RegExp("index\\.html$|pagedtable-1\\.1$").test(f); });
                          dir.remove(toDelete);
                          return $return(localPath);
                      }
                      
                  }
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }).bind(this), $error);
      }
      
      return $If_13.call(this);
  });
  };
  var boardPinRemoveRSConnect = function (board, name) { return new Promise(function ($return, $error) {
      var details;
      return rsconnectGetByName(board, name).then(function ($await_35) {
          try {
              details = $await_35;
              details = pinResultsExtractColumn(details, 'guid');
              return rsconnectApiDelete(board, path('/__api__/v1/experimental/content/', details.guid)).then(function ($await_36) {
                  try {
                      return $return();
                  } catch ($boundEx) {
                      return $error($boundEx);
                  }
              }, $error);
          } catch ($boundEx) {
              return $error($boundEx);
          }
      }, $error);
  }); };
  function boardPinVersionsRSConnect(board, name) {
      return new Promise(function ($return, $error) {
          var details, bundles;
          return rsconnectGetByName(board, name).then(function ($await_37) {
              try {
                  details = $await_37;
                  if (!details) {
                      return $error(new Error(("The pin '" + name + "' is not available in the '" + (board.name) + "' board.")));
                  }
                  return rsconnectApiGet(board, ("/__api__/v1/experimental/content/" + (details.guid) + "/bundles/")).then(function ($await_38) {
                      try {
                          bundles = $await_38;
                          return $return(dataFrame({
                              version: bundles.results.map(function (e) { return e.id; }),
                              created: bundles.results.map(function (e) { return e.created_time; }),
                              size: bundles.results.map(function (e) { return e.size; }),
                              stringsAsFactors: false
                          }));
                      } catch ($boundEx) {
                          return $error($boundEx);
                      }
                  }, $error);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }, $error);
      });
  }

  function pinLoadFiles(path, args) {
      var files = dir.list(path, {
          recursive: true,
          fullNames: true
      });
      var result = files.filter(function (e) { return !/data\.txt$/g.test(e); });
      return result;
  }

  function readCsv(strData, strDelimiter) {
      strDelimiter = strDelimiter || ',';
      var objPattern = new RegExp('(\\' + strDelimiter + '|\\r?\\n|\\r|^)' + '(?:"([^"]*(?:""[^"]*)*)"|' + '([^"\\' + strDelimiter + '\\r\\n]*))', 'gi');
      var arrData = [];
      var arrMatches = null;
      var isHeader = true;
      var columns = [];
      var columnIndex = 0;
      while (arrMatches = objPattern.exec(strData)) {
          var strMatchedDelimiter = arrMatches[1];
          if (strMatchedDelimiter.length && strMatchedDelimiter != strDelimiter) {
              arrData.push({});
              isHeader = false;
              columnIndex = 0;
          }
          if (arrMatches[2]) {
              var strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"');
          } else {
              var strMatchedValue = arrMatches[3];
          }
          if (isHeader) {
              columns.push(strMatchedValue);
          } else {
              arrData[arrData.length - 1][columns[columnIndex]] = strMatchedValue;
          }
          columnIndex++;
      }
      return arrData;
  }

  function pinsSaveCsv(x, name) {
      var columns = [];
      if (x.length > 0) {
          columns.push(Object.keys(x[0]).join(','));
      }
      var rows = columns.concat(x.map(function (row) { return Object.keys(row).map(function (key) { return row[key]; }).join(','); }));
      writeLines(name, rows);
  }

  function pinsSafeCsv(x, name) {
      try {
          return pinsSaveCsv(x, name);
      } catch (e) {
          pinLog('Failed to save data frame as CSV file: ' + e);
      }
  }

  function objectWithoutProperties$d (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  function pinDataFrame(x, opts) {
      if ( opts === void 0 ) opts = {
      name: null,
      description: null,
      board: null
  };

      return new Promise(function ($return, $error) {
          var assign, rest;

          var name, description, board, args, path$1;
          ((assign = opts, name = assign.name, description = assign.description, board = assign.board, rest = objectWithoutProperties$d( assign, ["name", "description", "board"] ), args = rest));
          if (isNull(name)) 
              { name = pinDefaultName(x, board); }
          path$1 = tempfile();
          dir.create(path$1, {
              recursive: true
          });
          write(JSON.stringify(x), path(path$1, 'data.json'));
          pinsSafeCsv(x, path(path$1, 'data.csv'));
          return onExit(function () { return dir.remove(path$1); }, function () { return new Promise(function ($return, $error) {
              var columns, metadata;
              columns = dfColNames(x);
              metadata = {
                  rows: x.length,
                  cols: columns.length,
                  columns: columns
              };
              return boardPinStore(board, Object.assign.apply(Object, [ {}, {
                  name: name,
                  description: description,
                  path: path$1,
                  type: 'table',
                  metadata: []
              } ].concat( args ))).then($return, $error);
          }); }).then($return, $error);
      });
  }

  function pinLoadTable(path$1) {
      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

      var json = path(path$1, 'data.json');
      var csv = path(path$1, 'data.csv');
      var result = null;
      if (fileExists(json)) {
          result = JSON.parse(readLines(json).join('\n\r'));
      } else if (fileExists(csv)) {
          result = readCsv(readLines(csv).filter(function (l) { return l; }).join('\n'));
      } else {
          throw new Error("A 'table' pin requires CSV or JSON files.");
      }
      return result;
  }

  registerMethod('pin', 'default', pinDefault);
  registerMethod('pin', 'string', pinString);
  registerMethod('pin', 'dataframe', pinDataFrame);
  registerMethod('pinPreview', 'default', pinPreviewDefault);
  registerMethod('pinLoad', 'default', pinLoadDefault);
  registerMethod('pinFetch', 'default', pinFetchDefault);
  registerMethod('pinLoad', 'files', pinLoadFiles);
  registerMethod('pinLoad', 'table', pinLoadTable);
  registerMethod('boardBrowse', 'default', boardBrowseDefault);
  registerMethod('boardPinVersions', 'default', boardPinVersionsDefault);
  registerMethod('boardInitialize', 'default', boardInitializeDefault);
  registerMethod('boardInitialize', 'local', boardInitializeLocal);
  registerMethod('boardPinCreate', 'local', boardPinCreateLocal);
  registerMethod('boardPinFind', 'local', boardPinFindLocal);
  registerMethod('boardPinGet', 'local', boardPinGetLocal);
  registerMethod('boardPinRemove', 'local', boardPinRemoveLocal);
  registerMethod('boardPinVersions', 'local', boardPinVersionsLocal);
  registerMethod('boardInitialize', 'datatxt', boardInitializeDatatxt);
  registerMethod('boardPinCreate', 'datatxt', boardPinCreateDatatxt);
  registerMethod('boardPinFind', 'datatxt', boardPinFindDatatxt);
  registerMethod('boardPinGet', 'datatxt', boardPinGetDatatxt);
  registerMethod('boardPinRemove', 'datatxt', boardPinRemoveDatatxt);
  registerMethod('boardPinVersions', 'datatxt', boardPinVersionsDatatxt);
  registerMethod('boardInitialize', 's3', boardInitializeS3);
  registerMethod('boardPinCreate', 's3', boardPinCreateDatatxt);
  registerMethod('boardPinFind', 's3', boardPinFindDatatxt);
  registerMethod('boardPinGet', 's3', boardPinGetDatatxt);
  registerMethod('boardPinRemove', 's3', boardPinRemoveDatatxt);
  registerMethod('boardPinVersions', 's3', boardPinVersionsDatatxt);
  registerMethod('boardInitialize', 'azure', boardInitializeAzure);
  registerMethod('boardInitialize', 'gcloud', boardInitializeGCloud);
  registerMethod('boardInitialize', 'dospaces', boardInitializeDospaces);
  registerMethod('boardInitialize', 'rsconnect', boardInitializeRSConnect);
  registerMethod('boardPinCreate', 'rsconnect', boardPinCreateRSConnect);
  registerMethod('boardPinFind', 'rsconnect', boardPinFindRSConnect);
  registerMethod('boardPinGet', 'rsconnect', boardPinGetRSConnect);
  registerMethod('boardPinRemove', 'rsconnect', boardPinRemoveRSConnect);
  registerMethod('boardPinVersions', 'rsconnect', boardPinVersionsRSConnect);
  registerMethod('rsconnectBundleCreate', 'default', rsconnectBundleCreateDefault);
  registerMethod('rsconnectBundleCreate', 'string', rsconnectBundleCreateString);
  registerMethod('rsconnectBundleCreate', 'dataframe', rsconnectBundleCreateDataFrame);

  exports.azureHeaders = azureHeaders;
  exports.boardConnect = boardConnect;
  exports.boardDeregister = boardDeregister;
  exports.boardDisconnect = boardDisconnect;
  exports.boardGet = boardGet$1;
  exports.boardInitializeAzure = boardInitializeAzure;
  exports.boardInitializeDospaces = boardInitializeDospaces;
  exports.boardInitializeGCloud = boardInitializeGCloud;
  exports.boardInitializeS3 = boardInitializeS3;
  exports.boardList = boardList;
  exports.boardRegister = boardRegister;
  exports.callbacks = callbacks;
  exports.dospacesHeaders = dospacesHeaders;
  exports.gcloudHeaders = gcloudHeaders;
  exports.pin = pin;
  exports.pinFetch = pinFetch;
  exports.pinFind = pinFind;
  exports.pinGet = pinGet;
  exports.pinInfo = pinInfo;
  exports.pinLoad = pinLoad;
  exports.pinPreview = pinPreview;
  exports.pinRemove = pinRemove;
  exports.pinVersions = pinVersions;
  exports.s3Headers = s3Headers;

  return exports;

}({}));
//# sourceMappingURL=pins.js.map
