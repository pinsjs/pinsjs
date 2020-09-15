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

  var isNull = function (obj) { return obj === null || typeof obj === 'undefined'; };

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
  var vectorize = function (func) { return function (x) {
      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

      var result = [];
      for (var idx = 0;idx > x.length; idx++) {
          result.push(fun.apply(void 0, [ x[idx] ].concat( args )));
      }
      return result;
  }; };
  var ensure = function (obj) {
      if (!Array.isArray(obj)) {
          return [obj];
      } else {
          return obj;
      }
  };
  var getOnly = function (obj) {
      if (Array.isArray(obj)) {
          if (obj.length == 1) {
              obj = obj[0];
          } else {
              throw new Error('Array has more than one element but expecting only one');
          }
      }
      return obj;
  };
  var maybeOne = function (obj) {
      if (Array.isArray(obj) && obj.length == 1) {
          return obj[0];
      }
      return obj;
  };
  var all = function (arr, callback) {
      for (i in arr) {
          if (!callback(i)) 
              { return false; }
      }
      return true;
  };

  var BOARDS_REGISTERED = {};
  var list = function () { return Object.keys(BOARDS_REGISTERED); };
  var get$1 = function (name) { return BOARDS_REGISTERED[name]; };
  var set$1 = function (name, board) {
      BOARDS_REGISTERED[name] = board;
  };

  var userCacheDir = function () { return callbacks.get('userCacheDir')('pins'); };

  var boardCachePath = function () { return getOption('pins.path', userCacheDir()); };

  var tempfile = function () { return callbacks.get('tempfile')(); };
  var basename = function (filePath) { return callbacks.get('basename')(filePath); };
  var readLines = function (filePath) { return callbacks.get('readLines')(filePath); };
  var writeLines = function (filePath, content) { return callbacks.get('writeLines')(filePath, content); };
  var dir = Object.freeze({
      create: function create(dirPath, ref) {
          if ( ref === void 0 ) ref = {
          recursive: false
      };
          var recursive = ref.recursive;

          return callbacks.get('dirCreate')(dirPath);
      },
      exists: function exists(dirPath) {
          return callbacks.get('dirExists')(dirPath);
      },
      list: function list(dirPath) {
          var args = [], len = arguments.length - 1;
          while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

          return callbacks.get('dirList')(getOnly(dirPath));
      },
      remove: function remove(dirPath) {
          var args = [], len = arguments.length - 1;
          while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

          dirPath = ensure(dirPath);
          return dirPath.map(function (e) { return callbacks.get('dirRemove')(dirPath); });
      },
      zip: function zip(dirPath, zipfile, commonPath) {
          var args = [], len = arguments.length - 3;
          while ( len-- > 0 ) args[ len ] = arguments[ len + 3 ];

          return callbacks.get('dirZip')(dirPath, dirPath, commonPath);
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
  var write = function (object, path) { return callbacks.get('fileWrite')(object, path); };
  var read = function (path) { return callbacks.get('fileRead')(path); };
  var path = function (path1, path2) { return callbacks.get('filePath')(path1, path2); };
  var normalizePath = function (path, ref) {
      if ( ref === void 0 ) ref = {
      winslash: '\\',
      mustWork: false
  };
      var winslash = ref.winslash;
      var mustWork = ref.mustWork;

      return path;
  };
  var absolutePath = function (path) { return path; };
  var dirname = function (path) { return path.replace(/[^\/]+$/, ''); };
  var lockFile = function (path, timeout) { return callbacks.get('fileExists')(path); };
  var unlockFile = function (path) { return callbacks.get('fileExists')(path); };
  var fileExists = function (path) { return callbacks.get('fileExists')(path); };
  var copy = function (from, to, ref) {
      if ( ref === void 0 ) ref = {
      recursive: true
  };
      var recursive = ref.recursive;

      return callbacks.get('fileCopy')(from, to, recursive);
  };
  var createLink = function (from, to) { return callbacks.get('createLink')(path); };
  var fileSize = function (path) { return callbacks.get('fileSize')(path); };

  var md5 = function (filePath) { return callbacks.get('md5')(filePath); };

  var dataFrame = function (data, columns) {
      var df = [];
      if (!isNull(data)) {
          df = data;
      }
      df.columns = columns;
      return df;
  };
  var dfColNames = function (df) {
      if (df.hasOwnProperty('columns')) 
          { return Object.keys(df['columns']); }
      if (df.length > 0) 
          { return Object.keys(df[0]); }
      return [];
  };
  var dfCBind = function (df1, df2) {
      var rows = df1.map(function (left, idx) {
          var row = {};
          Object.assign(row, left);
          Object.assign(row, df2[idx]);
          return row;
      });
      var cols = Object.assign({}, df1.columns);
      Object.assign(cols, df2.columns);
      return dataFrame(rows, cols);
  };
  var dfColRemove = function (df, col) {
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
  };
  var dfIsDataFrame = function (obj) {
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
  };

  var boardDefault = function () { return getOption('pins.board', 'local'); };

  var boardLocalStorage = function (board) {
      var path$1 = board['cache'];
      var componentPath = path(path$1, board['name']);
      if (!dir.exists(componentPath)) 
          { dir.create(componentPath, {
          recursive: true
      }); }
      return normalizePath(componentPath, {
          mustWork: false
      });
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
      for (var idx = 0;idx < args.length - 2; idx++) 
          { args[idx](); }
      if (error !== null) 
          { throw error; }
      return result;
  };

  var pinLog = function () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      if (getOption('pins.verbose', true)) {
          callbacks.get('pinLog')(args.join(''));
      }
  };
  var pinDebug = function (method, params) {
      if (getOption('pins.verbose', true)) {
          callbacks.get('pinLog')('Calling ' + method + '(' + JSON.stringify(params) + ')');
      }
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
  for (var i$1 = 0;i$1 < 256; i$1++) {
      simpleEscapeCheck[i$1] = simpleEscapeSequence(i$1) ? 1 : 0;
      simpleEscapeMap[i$1] = simpleEscapeSequence(i$1);
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
              if (state.result !== null && state.kind !== 'scalar') {
                  throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
              }
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
      var nullpos = input.indexOf('\0');
      if (nullpos !== -1) {
          state.position = nullpos;
          throwError(state, 'null byte is not allowed in input');
      }
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
      if (iterator !== null && typeof iterator === 'object' && typeof options === 'undefined') {
          options = iterator;
          iterator = null;
      }
      var documents = loadDocuments(input, options);
      if (typeof iterator !== 'function') {
          return documents;
      }
      for (var index = 0, length = documents.length;index < length; index += 1) {
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

  function safeLoadAll(input, iterator, options) {
      if (typeof iterator === 'object' && iterator !== null && typeof options === 'undefined') {
          options = iterator;
          iterator = null;
      }
      return loadAll(input, iterator, common.extend({
          schema: default_safe
      }, options));
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
  var CHAR_CARRIAGE_RETURN = 0x0D;
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
  var CHAR_EQUALS = 0x3D;
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

  function isNsChar(c) {
      return isPrintable(c) && !isWhitespace(c) && c !== 0xFEFF && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
  }

  function isPlainSafe(c, prev) {
      return isPrintable(c) && c !== 0xFEFF && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_COLON && (c !== CHAR_SHARP || prev && isNsChar(prev));
  }

  function isPlainSafeFirst(c) {
      return isPrintable(c) && c !== 0xFEFF && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
  }

  function needIndentIndicator(string) {
      var leadingSpaceRe = /^\n* /;
      return leadingSpaceRe.test(string);
  }

  var STYLE_PLAIN = 1, STYLE_SINGLE = 2, STYLE_LITERAL = 3, STYLE_FOLDED = 4, STYLE_DOUBLE = 5;
  function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType) {
      var i;
      var char, prev_char;
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
              prev_char = i > 0 ? string.charCodeAt(i - 1) : null;
              plain = plain && isPlainSafe(char, prev_char);
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
              prev_char = i > 0 ? string.charCodeAt(i - 1) : null;
              plain = plain && isPlainSafe(char, prev_char);
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
          pairBuffer = '';
          if (index !== 0) 
              { pairBuffer += ', '; }
          if (state.condenseFlow) 
              { pairBuffer += '"'; }
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

  var dictRemove = function (dict, removes) {
      var copy = {};
      Object.assign(copy, dict);
      removes.forEach(function (remove) {
          if (copy.hasOwnProperty(remove)) 
              { delete copy[remove]; }
      });
      return copy;
  };

  var pinSplitOwner = function (fullName) {
      if ( fullName === void 0 ) fullName = '';

      var parts = fullName.split('/');
      var name = parts[0];
      parts.pop();
      var owner = parts.join('/');
      return {
          name: name,
          owner: owner
      };
  };
  var pinContentName = function (fullName) { return typeof fullName === 'string' ? pinSplitOwner(fullName).name : fullName; };
  var pinResultsFromRows = function (entries) {
      var resultsField = function (e, field, def) {
          return isNull(e[field]) ? def : e[field];
      };
      var rows = entries.map(function (e) {
          var row = {
              name: resultsField(e, 'name', basename(e['path'])),
              description: resultsField(e, 'description', ''),
              type: resultsField(e, 'type', 'files')
          };
          row['metadata'] = dictRemove(e, ['name','description','type']);
          return row;
      });
      return dataFrame(rows, {
          name: 'character',
          description: 'character',
          type: 'character'
      });
  };
  var pinResultsMerge = function (r1, r2) {
      var result = [].concat(r1).concat(r2);
      result.columns = {};
      Object.assign(result.columns, r1.columns);
      Object.assign(result.columns, r2.columns);
      return result;
  };

  var tryCatch = function (expr, error) {
      try {
          return expr();
      } catch (err) {
          return error(err);
      }
  };
  var tryCatchNull = function (expr, error) { return tryCatch(expr, function () { return null; }); };

  var pinRegistryConfig = function (board) { return path(boardLocalStorage(board), 'data.txt'); };
  var pinRegistryLoadEntries = function (board) {
      var lock = pinRegistryLock(board);
      return onExit(function () { return pinRegistryUnlock(lock); }, function () {
          var entriesPath = pinRegistryConfig(board);
          if (!fileExists(entriesPath)) {
              return [];
          } else {
              var yamlText = readLines(entriesPath).join('\n');
              var loadedYaml = jsYaml$1.safeLoad(yamlText);
              return loadedYaml;
          }
      });
  };
  var pinRegistrySaveEntries = function (entries, board) {
      var lock = pinRegistryLock(board);
      return onExit(function () { return pinRegistryUnlock(lock); }, function () {
          var yamlText = jsYaml$1.safeDump(entries);
          writeLines(pinRegistryConfig(board), yamlText.split('\n'));
      });
  };
  var pinStoragePath = function (board, name) {
      var path$1 = path(boardLocalStorage(board), name);
      if (!dir.exists(path$1)) {
          dir.create(path$1, {
              recursive: true
          });
      }
      return path$1;
  };
  var pinRegistryUpdate = function (name, board, params) {
      if ( params === void 0 ) params = {};

      var lock = pinRegistryLock(board);
      return onExit(function () { return pinRegistryUnlock(lock); }, function () {
          var entries = pinRegistryLoadEntries(board);
          name = pinRegistryQualifyName(name, entries);
          var path = pinStoragePath(board, name);
          if (entries === null) 
              { entries = []; }
          var names = entries.map(function (e) { return e.name; });
          var index = 0;
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
          pinRegistrySaveEntries(entries, board);
          return path;
      });
  };
  var pinRegistryFind = function (text, board) {
      var lock = pinRegistryLock(board);
      return onExit(function () { return pinRegistryUnlock(lock); }, function () {
          var entries = pinRegistryLoadEntries(board);
          var results = pinResultsFromRows(entries);
          if (typeof text === 'string' && text.length > 0) {
              results = results.filter(function (x) { return new RegExp(text, 'gi').test(x['name']); });
          }
          return results;
      });
  };
  var pinRegistryRetrieve = function (name, board) {
      var lock = pinRegistryLock(board);
      return onExit(function () { return pinRegistryUnlock(lock); }, function () {
          var entries = pinRegistryLoadEntries(board);
          name = pinRegistryQualifyName(name, entries);
          var names = entries.map(function (e) { return e.name; });
          if (!names.includes(name)) {
              pinLog(("Pin not found, pins available in registry: " + (names.join(', '))));
              throw new Error(("Pin '" + name + "' not found in '" + (board.name) + "' board."));
          }
          return entries.find(function (e) { return e.name === name; });
      });
  };
  var pinRegistryRetrievePath = function (name, board) {
      var entry = pinRegistryRetrieve(name, board);
      return entry['path'];
  };
  var pinRegistryRetrieveMaybe = function (name, board) { return tryCatchNull(function () { return pinRegistryRetrieve(name, board); }); };
  var pinRegistryRemove = function (name, board, unlink) {
      if ( unlink === void 0 ) unlink = true;

      var entries = pinRegistryLoadEntries(board);
      name = pinRegistryQualifyName(name, entries);
      var remove = entries.filter(function (x) { return x['name'] == name; });
      if (remove.length > 0) 
          { remove = remove[0]; }
       else 
          { return; }
      entries = entries.filter(function (x) { return x['name'] != name; });
      var removePath = pinRegistryAbsolute(remove.path, board);
      if (unlink) 
          { dir.remove(removePath, {
          recursive: true
      }); }
      return pinRegistrySaveEntries(entries, board);
  };
  var pinRegistryQualifyName = function (name, entries) {
      var names = entries.map(function (e) { return e['name']; });
      var namePattern = '';
      if (/\//g.test(name)) 
          { namePattern = paste0('^', name, '$'); }
       else 
          { namePattern = '.*/' + name + '$'; }
      var nameCandidate = names.filter(function (e) { return new RegExp(namePattern, 'gi').test(e); });
      if (nameCandidate.length == 1) {
          name = nameCandidate;
      }
      return name;
  };
  var pinRegistryLock = function (board) {
      var lockFile$1 = pinRegistryConfig(board) + '.lock';
      return lockFile(lockFile$1, getOption('pins.lock.timeout', Infinity));
  };
  var pinRegistryUnlock = function (lock) { return unlockFile(lock); };
  var pinRegistryRelative = function (path, basePath) {
      path = normalizePath(path, {
          winslash: '/',
          mustWork: false
      });
      basePath = normalizePath(basePath, {
          winslash: '/',
          mustWork: false
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
          return normalizePath(path(basePath, path$1), {
              mustWork: false
          });
      }
  };
  var pinResetCache = function (board, name) {
      var sanitizedName = name.replace(/^https?:\/\//g, '');
      var index = tryCatchNull(function () { return pinRegistryRetrieve(sanitizedName, board) || null; });
      if (!isNull(index)) {
          index.cache = {};
          pinRegistryUpdate(sanitizedName, board, {
              params: index
          });
      }
  };

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

  var pinManifestGet = function (path$1) {
      var manifest = {};
      var dataTxt = path(path$1, 'data.txt');
      if (fileExists(dataTxt)) {
          var yamlText = readLines(dataTxt).join('\n');
          yamlText = yamlText.replace(/(!expr )(.*)\n/g, '$2\n');
          manifest = jsYaml$1.safeLoad(yamlText);
      }
      if (isNull(manifest['type'])) 
          { manifest['type'] = 'files'; }
      return manifest;
  };
  var pinManifestUpdate = function (path$1, manifest) {
      var dataTxt = path(path$1, 'data.txt');
      var yamlText = jsYaml$1.safeDump(manifest);
      writeLines(dataTxt, yamlText.split('\n'));
  };
  var pinManifestExists = function (path$1) { return fileExists(path(path$1, 'data.txt')); };
  var pinManifestCreate = function (path$1, metadata, files) {
      var entries = Object.assign({
          path: files
      }, metadata);
      removeNulls(entries);
      var yamlText = jsYaml$1.safeDump(entries);
      writeLines(path(path$1, 'data.txt'), yamlText.split('\n'));
      return entries;
  };
  var pinManifestDownload = function (path) {
      var manifest = pinManifestGet(path);
      if (isNull(manifest['path'])) 
          { return null; }
      return pinFetch({
          path: manifest['path'],
          class: manifest['type']
      });
  };
  var pinManifestMerge = function (baseManifest, resourceManifest) {
      if (!isNull(resourceManifest['path']) && !isNull(baseManifest['path']) && !/https?:\/\//g.test(baseManifest['path'])) {
          baseManifest['path'] = path(baseManifest['path'], resourceManifest['path']);
      }
      baseManifest = Object.assign(baseManifest, resourceManifest);
      return baseManifest;
  };

  var pinVersionsPathName = function () { return getOption('pins.versions.path', '_versions'); };
  var pinVersionSignature$1 = function (hashFiles) {
      var sign = hashFiles.map(function (f) { return md5(f); });
      if (sign.length > 1) {
          sign = sign.join(',');
          sign = md5(sign);
          return sign;
      } else {
          return sign[0];
      }
  };
  var pinVersionsPath = function (storagePath) {
      var hashFiles = dir.list(storagePath, {
          fullNames: true
      });
      hashFiles = hashFiles.filter(function (e) { return !/(\/|\\)_versions$/g.test(e); });
      var versionPath = path(pinVersionsPathName(), pinVersionSignature$1(hashFiles));
      return normalizePath(path(normalizePath(storagePath), versionPath), {
          mustWork: false
      });
  };
  var boardVersionsEnabled = function (board, ref) {
      if ( ref === void 0 ) ref = {
      defaultValue: false
  };
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
  };
  var boardVersionsGet = function (board, name) {
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
  };
  var boardVersionsShorten = function (versions) {
      var paths = versions.map(function (e) { return e.replace('[^/\\\\]+$', ''); });
      if (paths.filter(function (v, i, arr) { return arr.indexOf(v) === i; }).length > 0) {
          versions = versions.map(function (e) { return e.replace(/.*(\/|\\)/g, ''); });
      }
      var shortened = versions.map(function (e) { return e.substr(0, 7); });
      if (shortened.filter(function (v, i, arr) { return arr.indexOf(v) === i; }).length == versions.length) {
          versions = shortened;
      }
      return versions;
  };
  var boardVersionsExpand = function (versions, version) {
      var shortened = boardVersionsShorten(versions);
      var versionIndex = shortened.indexOf(version);
      if (versionIndex === -1) {
          throw new Error("Version '" + version + "' is not valid, please select from pin_versions().");
      }
      return versions[versionIndex];
  };

  function objectWithoutProperties (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  var boardInitializeLocal = function (board, ref) {
      var rest = objectWithoutProperties( ref, [] );
      if (!dir.exists(board['cache'])) 
          { dir.create(board['cache'], {
          recursive: true
      }); }
      return board;
  };
  var boardPinCreateLocal = function (board, path, name, metadata) {
      var args = [], len = arguments.length - 4;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 4 ];

      boardVersionsCreate(board, name, path);
      var finalPath = pinStoragePath(board, name);
      var toDelete = dir.list(finalPath, {
          fullNames: true
      }).filter(function (e) { return /(\/|\\)_versions/gi.test(e); });
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
      var basePath = boardLocalStorage(board);
      return pinRegistryUpdate(name, board, Object.assign({
          path: pinRegistryRelative(finalPath, {
              basePath: basePath
          })
      }, metadata));
  };
  var boardPinFindLocal = function (board, text, ref) {
      var rest = objectWithoutProperties( ref, [] );

      var results = pinRegistryFind(text, board);
      if (results.length == 1) {
          var metadata = results[0]['metadata'];
          var path = pinRegistryAbsolute(metadata['path'], board);
          var extended = pinManifestGet(path);
          var merged = pinManifestMerge(metadata, extended);
          results[0]['metadata'] = merged;
      }
      return results;
  };
  var boardPinGetLocal = function (board, name, ref) {
      var rest = objectWithoutProperties( ref, [] );
      var args = rest;

      var version = args['version'];
      var path$1 = pinRegistryRetrievePath(name, board);
      if (!isNull(version)) {
          var manifest = pinManifestGet(pinRegistryAbsolute(path$1, board));
          if (!manifest['versions'].includes(version)) {
              version = boardVersionsExpand(manifest['versions'], version);
          }
          path$1 = path(name, version);
      }
      return pinRegistryAbsolute(path$1, board);
  };
  var boardPinRemoveLocal = function (board, name) { return pinRegistryRemove(name, board); };
  var boardPinVersionsLocal = function (board, name) { return boardVersionsGet(board, name); };

  var METHODS = {};
  var DEFAULT_CLASS_NAME = 'default';
  var initializeMethod = function (methodName, object) {
      var args = [], len = arguments.length - 2;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

      pinDebug('useMethod', Object.assign.apply(Object, [ {
          object: object
      } ].concat( args )));
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
  };
  var registerMethod = function (methodName, className, method) {
      METHODS[methodName] = METHODS[methodName] || {};
      METHODS[methodName][className] = method;
      return method;
  };
  var useMethodAsync = function (methodName, object) {
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
  };
  var useMethod = function (methodName, object) {
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
  };

  function objectWithoutProperties$1 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  var boardPinCreate = function (board, path, name, metadata) {
      var args = [], len = arguments.length - 4;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 4 ];

      return useMethod.apply(void 0, [ 'boardPinCreate', board, path, name, metadata ].concat( args ));
  };
  var boardInitialize = function (board, ref) {
      var rest = objectWithoutProperties$1( ref, [] );
      var args = rest;

      return new Promise(function ($return, $error) {
      return useMethodAsync.apply(void 0, [ 'boardInitialize', board ].concat( args )).then($return, $error);
  });
  };
  var boardInitializeDefault = function (board) {
      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

      throw new Error("Board '" + board['name'] + "' is not a valid board.");
  };
  var boardPinGet = function (board, name) {
      var args = [], len = arguments.length - 2;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

      return new Promise(function ($return, $error) {
      return $return(useMethodAsync.apply(void 0, [ 'boardPinGet', board, name ].concat( args )));
  });
  };
  var boardPinRemove = function (board, name) {
      var args = [], len = arguments.length - 2;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

      return useMethod.apply(void 0, [ 'boardPinRemove', board, name ].concat( args ));
  };
  var boardPinFind = function (board, text) {
      var args = [], len = arguments.length - 2;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

      return new Promise(function ($return, $error) {
      return $return(useMethodAsync.apply(void 0, [ 'boardPinFind', board, text ].concat( args )));
  });
  };
  var boardPinVersions = function (board, name) {
      var args = [], len = arguments.length - 2;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

      return useMethod.apply(void 0, [ 'boardPinVersions', board, name ].concat( args ));
  };
  var boardBrowseDefault = function (board) {
      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

      return null;
  };
  var boardEmptyResults = function () { return dataFrame(null, {
      name: 'character',
      description: 'character',
      rows: 'numeric',
      cols: 'numeric',
      class: 'numeric'
  }); };
  var boardPinVersionsDefault = function (board, name) {
      var args = [], len = arguments.length - 2;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

      return dataFrame(null, {
      version: 'character'
  });
  };

  function objectWithoutProperties$2 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  var newBoard = function (board, name, cache, versions) {
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
          registerCall: registerCall
      };
      if (/^http:\/\/|^https:\/\//g.test(x)) {
          inferred['url'] = x;
          inferred['board'] = 'datatxt';
          if (name == null || x === name) {
              inferred['name'] = inferred['url'].replace(/https?:\/\//g, '').replace(/\\\\..*/g, '');
          }
          inferred['registerCall'] = 'pins::board_register(board = "datatxt", name = "' + inferred['name'] + '", url = "' + inferred['url'] + '")';
      }
      if (inferred['name'] == null) 
          { inferred['name'] = x; }
      if (inferred['board'] == null) 
          { inferred['board'] = x; }
      return inferred;
  };
  var boardRegisterCode = function (board, name) { return callbacks.get('boardRegisterCode')(board, name); };
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
      pinDebug('boardList', {});
      var defaults = concat(['local'], boardDefault());
      var boards = concat(list(), defaults);
      return unique(boards);
  };
  var boardGet = function (name) {
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
              pinLog("Failed to register board " + name + ": " + err.toString());
          }
          if (!list().includes(name)) {
              throw "Board '" + name + "' not a board, available boards: " + boardList().join(', ');
          }
      }
      return get$1(name);
  };
  var boardRegister = function (board, ref) {
      var name = ref.name;
      var cache = ref.cache;
      var versions = ref.versions;
      var rest = objectWithoutProperties$2( ref, ["name", "cache", "versions"] );
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
  };
  var boardDeregister = function (name) {
      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

      throw 'NYI';
  };

  var uiViewerUpdated = function (board) {
      get('uiViewerUpdated')();
  };

  function objectWithoutProperties$3 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  var pin = function (x) {
      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

      return new Promise(function ($return, $error) {
      pinDebug('pin', Object.assign.apply(Object, [ {
          x: x
      } ].concat( args )));
      return useMethodAsync.apply(void 0, [ 'pin', x ].concat( args )).then(function ($await_14) {
          try {
              return $return(maybeOne($await_14));
          } catch ($boundEx) {
              return $error($boundEx);
          }
      }, $error);
  });
  };
  var pinGet = function (name, ref) {
      var board = ref.board;
      var cache = ref.cache;
      var extract = ref.extract;
      var version = ref.version;
      var files = ref.files;
      var signature = ref.signature;
      var rest = objectWithoutProperties$3( ref, ["board", "cache", "extract", "version", "files", "signature"] );
      var args = rest;

      return new Promise(function ($return, $error) {
      var boardPinGetOrNull, result, manifest, resultFiles, pinSignature;
      if (isNull(board)) {
          boardPinGetOrNull = (function () {
              var args = [], len = arguments.length;
              while ( len-- ) args[ len ] = arguments[ len ];

              return new Promise(function ($return, $error) {
              var $Try_1_Catch = function (err) {
                  try {
                      return $return(null);
                  } catch ($boundEx) {
                      return $error($boundEx);
                  }
              };
              try {
                  return boardPinGet.apply(void 0, args).then($return, $Try_1_Catch);
              } catch (err) {
                  $Try_1_Catch();
              }
          });
          });
          return boardPinGetOrNull(boardGet(null), name, {
              version: version
          }).then((function ($await_16) {
              try {
                  result = $await_16;
                  if (isNull(result) && isNull(board)) {
                      var $idx_5, $in_6 = [];
                      for ($idx_5 in boardList()) 
                          { $in_6.push($idx_5); }
                      var boardName;
                      var $Loop_7_trampoline;
                      function $Loop_7() {
                          if ($in_6.length) {
                              boardName = $in_6.shift();
                              if (!cache) 
                                  { pinResetCache(boardName, name); }
                              return boardPinGetOrNull(boardGet(boardName), name, {
                                  extract: extract,
                                  version: version
                              }).then(function ($await_17) {
                                  try {
                                      result = $await_17;
                                      if (!isNull(result)) {
                                          pinLog('Found pin ' + name + ' in board ' + boardName);
                                          return [1];
                                      }
                                      return $Loop_7;
                                  } catch ($boundEx) {
                                      return $error($boundEx);
                                  }
                              }, $error);
                          } else 
                              { return [1]; }
                      }
                      
                      return ($Loop_7_trampoline = (function (q) {
                          while (q) {
                              if (q.then) 
                                  { return void q.then($Loop_7_trampoline, $error); }
                              try {
                                  if (q.pop) 
                                      { if (q.length) 
                                      { return q.pop() ? $Loop_7_exit.call(this) : q; }
                                   else 
                                      { q = $Loop_7; } }
                                   else 
                                      { q = q.call(this); }
                              } catch (_exception) {
                                  return $error(_exception);
                              }
                          }
                      }).bind(this))($Loop_7);
                      function $Loop_7_exit() {
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
          if (!cache) 
              { pinResetCache(board, name); }
          return boardPinGet(boardGet(board), name, Object.assign.apply(Object, [ {
              extract: extract,
              version: version
          } ].concat( args ))).then((function ($await_18) {
              try {
                  result = $await_18;
                  return $If_3.call(this);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }).bind(this), $error);
      }
      function $If_3() {
          manifest = pinManifestGet(result);
          if (isNull(manifest['type'])) 
              { manifest['type'] = 'files'; }
          resultFiles = ensure(result).filter(function (e) { return !new RegExp('^' + pinVersionsPathName()).test(e); });
          resultFiles = dir.list(resultFiles, {
              fullNames: true
          });
          if (manifest['type'] == 'files' && resultFiles.length > 1) 
              { resultFiles = resultFiles.filter(function (e) { return !/\/data\.txt$/g.test(e); }); }
          if (!isNull(signature)) {
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
  };
  var pinRemove = function (name, board) {
      board = boardGet(board);
      boardPinRemove(board, name);
      uiViewerUpdated();
      return null;
  };
  var pinFindEmpty = function () { return dataFrame(null, {
      name: 'character',
      description: 'character',
      type: 'character',
      metadata: 'character',
      board: 'character'
  }); };
  var pinFind = function (text, ref) {
      var board = ref.board;
      var name = ref.name;
      var extended = ref.extended;
      var metadata = ref.metadata;
      var rest = objectWithoutProperties$3( ref, ["board", "name", "extended", "metadata"] );
      var args = rest;

      return new Promise(function ($return, $error) {
      var allPins, boardName, boardObject, boardPins;
      if (isNull(board) || board.length == 0) 
          { board = boardList(); }
      text = pinContentName(text);
      if (isNull(text) && !isNull(name)) 
          { text = name; }
      allPins = pinFindEmpty();
      board = ensure(board);
      var $idx_9, $in_10 = [];
      for ($idx_9 in board) 
          { $in_10.push($idx_9); }
      var boardIdx;
      var $Loop_11_trampoline;
      function $Loop_11() {
          if ($in_10.length) {
              boardIdx = $in_10.shift();
              boardName = board[boardIdx];
              boardObject = boardGet(boardName);
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
                      return $Loop_11;
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
                  return boardPinFind(boardObject, text, Object.assign.apply(Object, [ {
                      name: name,
                      extended: extended
                  } ].concat( args ))).then(function ($await_19) {
                      try {
                          boardPins = $await_19;
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
      
      return ($Loop_11_trampoline = (function (q) {
          while (q) {
              if (q.then) 
                  { return void q.then($Loop_11_trampoline, $error); }
              try {
                  if (q.pop) 
                      { if (q.length) 
                      { return q.pop() ? $Loop_11_exit.call(this) : q; }
                   else 
                      { q = $Loop_11; } }
                   else 
                      { q = q.call(this); }
              } catch (_exception) {
                  return $error(_exception);
              }
          }
      }).bind(this))($Loop_11);
      function $Loop_11_exit() {
          if (!isNull(text)) {
              allPins = allPins.filter(function (e) { return e['name'] == text || (isNull(e['description']) ? false : new RegExp(text, 'i').test(e['description'])); });
          }
          if (!metadata) {
              allPins = dfColRemove(allPins, 'metadata');
          }
          if (!isNull(name)) {
              allPins = allPins.filter(function (e) { return new RegExp('(.*/)?' + name + '$').test(e['name']); });
              if (allPins.length > 0) 
                  { allPins = allPins.filter(function (e, idx) { return idx === 0; }); }
          }
          allPins = allPins.sort(function (a, b) { return a['name'] < a['name']; });
          return $return(allPins);
      }
      
  });
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
  var pinGetOne = function (name, board, extended, metadata) { return new Promise(function ($return, $error) {
      var entry;
      return pinFind(null, {
          name: name,
          board: board,
          metadata: false,
          extended: false
      }).then(function ($await_21) {
          try {
              entry = $await_21;
              if (entry.length == 0) 
                  { return $error(new Error("Pin '" + name + "' was not found.")); }
              if (entry.length > 1) 
                  { return $error(new Error("Pin '" + name + "' was found in multiple boards: " + entry['board'].join(',') + '.')); }
              board = entry[0]['board'];
              return pinFind(null, {
                  name: name,
                  board: board,
                  metadata: metadata,
                  extended: extended
              }).then(function ($await_22) {
                  try {
                      entry = $await_22;
                      return $return(entry[0]);
                  } catch ($boundEx) {
                      return $error($boundEx);
                  }
              }, $error);
          } catch ($boundEx) {
              return $error($boundEx);
          }
      }, $error);
  }); };
  var pinInfo = function (name, ref) {
      var board = ref.board;
      var extended = ref.extended;
      var metadata = ref.metadata;
      var signature = ref.signature;
      var rest = objectWithoutProperties$3( ref, ["board", "extended", "metadata", "signature"] );

      return new Promise(function ($return, $error) {
      var entry, board, files, entryExt;
      return pinGetOne(name, board, extended, metadata).then((function ($await_23) {
          try {
              entry = $await_23;
              board = entry['board'];
              metadata = [];
              if (Object.keys(entry).includes('metadata') && entry.metadata.columns.length > 0) {
                  metadata = entry['metadata'];
              }
              if (signature) {
                  return pinGet(name, {
                      board: board,
                      files: true
                  }).then((function ($await_24) {
                      try {
                          files = $await_24;
                          entry['signature'] = pinVersionSignature(files);
                          return $If_13.call(this);
                      } catch ($boundEx) {
                          return $error($boundEx);
                      }
                  }).bind(this), $error);
              }
              function $If_13() {
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
              
              return $If_13.call(this);
          } catch ($boundEx) {
              return $error($boundEx);
          }
      }).bind(this), $error);
  });
  };
  var pinFetch$1 = function () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      return useMethod.apply(void 0, [ 'pinFetch' ].concat( args ));
  };
  var pinVersions = function (name, ref) {
      var board = ref.board;
      var full = ref.full; if ( full === void 0 ) full = false;
      var rest = objectWithoutProperties$3( ref, ["board", "full"] );

      var versions = boardPinVersions(boardGet(board), name);
      if (!full) {
          versions['version'] = boardVersionsShorten(versions['version']);
      }
      return versions;
  };

  var BoardName = Object.freeze({
      kaggle: 'kaggle'
  });

  var pinDefaultName = function (x, board) {
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
  };

  var pinsMergeCustomMetadata = function (metadata, customMetadata) {
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
                  var foundIdx = metadata$columns.filter(function (e, i) { return metadata['columns'][i]['name'] === column['name']; });
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

  function objectWithoutProperties$4 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  var boardPinStore = function (board, opts) {
      var ref = Object.assign({
          retrieve: true
      }, opts);
      var path$1 = ref.path;
      var description = ref.description;
      var type = ref.type;
      var metadata = ref.metadata;
      var extract = ref.extract;
      var retrieve = ref.retrieve;
      var rest = objectWithoutProperties$4( ref, ["path", "description", "type", "metadata", "extract", "retrieve"] );
      var args = rest;
      path$1 = ensure(path$1);
      var customMetadata = args['customMetadata'];
      var zip = args['zip'];
      if (isNull(extract)) 
          { extract = true; }
      var boardInstance = boardGet(board);
      var name = opts.name || vectorize()(pinPath);
      pinLog(("Storing " + name + " into board " + (boardInstance.name) + " with type " + type));
      if (!args.cache) 
          { pinResetCache(boardInstance, name); }
      path$1 = path$1.filter(function (x) { return !/data\.txt/g.test(x); });
      var storePath = tempfile();
      dir.create(storePath);
      return onExit(function () { return unlink(storePath, {
          recursive: true
      }); }, function () {
          if (path$1.length == 1 && /^http/g.test(path$1) && !/\\.[a-z]{2,4}$/g.test(path$1) && getOption('pins.search.datatxt', true)) {
              datatxtPath = path(path$1, 'data.txt');
              localPath = pinDownload(datatxtPath, name, boardDefault(), {
                  canFail: true
              });
              if (!is.null(local_path)) {
                  manifest = pinManifestGet(localPath);
                  path$1 = path$1 + '/' + manifest[path$1];
                  extract = false;
              }
          }
          var somethingChanged = false;
          if (zip === true) {
              var findCommonPath = function (path) {
                  var common = path[0];
                  if (all(path, function (common) { return startsWith(common); }) || common === dirname(common)) 
                      { return common; }
                  return findCommonPath(dirname(common[0]));
              };
              var commonPath = findCommonPath(path$1);
              dir.zip(commonPath.map(function (e) { return e.replace(common_path + '/', ''); }), path(storePath, 'data.zip'), commonPath);
              somethingChanged = true;
          } else {
              for (var idxPath = 0;idxPath < path$1.length; idxPath++) {
                  var details = {
                      somethingChanged: true
                  };
                  var singlePath = path$1[idxPath];
                  if (/^http/g.test(singlePath)) {
                      singlePath = pin_download(singlePath, name, boardDefault(), Object.assign({
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
                  if (details['somethingChanged']) {
                      var copyOrLink = function (from, to) {
                          if (fileExists(from) && fileSize(from) >= getOption('pins.link.size', 10 ^ 8)) 
                              { createLink(from, path(to, basename(from))); }
                           else 
                              { copy(from, to, {
                              recursive: true
                          }); }
                      };
                      if (dir.exists(singlePath)) {
                          for (entry in dir.list(singlePath, {
                              fullNames: true
                          })) {
                              copyOrLink(entry, store_path);
                          }
                      } else {
                          copyOrLink(singlePath, storePath);
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
                  pinManifestCreate(storePath, metadata, dir.list(storePath, {
                      recursive: true
                  }));
              }
              boardPinCreate.apply(void 0, [ boardInstance, storePath, name, metadata ].concat( args ));
              uiViewerUpdated();
          }
          if (retrieve) {
              return pinGet(name, Object.assign.apply(Object, [ {
                  board: boardInstance['name']
              } ].concat( args )));
          } else {
              return null;
          }
      });
  };

  function objectWithoutProperties$5 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  var pinDefault = function (x, opts) {
      if ( opts === void 0 ) opts = {};

      pinDebug('pinDefault', {
          x: x,
          opts: opts
      });
      var description = opts.description;
      var board = opts.board;
      var rest = objectWithoutProperties$5( opts, ["description", "board"] );
      var args = rest;
      var name = opts.name || pinDefaultName(x, board);
      var path$1 = tempfile();
      dir.create(path$1);
      write(JSON.stringify(x), path(path$1, 'data.json'));
      return boardPinStore(board, Object.assign.apply(Object, [ {}, {
          name: name,
          description: description,
          path: path$1,
          type: 'default',
          metadata: []
      } ].concat( args )));
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

  var fetch = function () { return callbacks.get('fetch'); };

  var boardManifestGet = function (path, defaultEmpty) {
      if ( defaultEmpty === void 0 ) defaultEmpty = false;

      if (!fileExists(path) && defaultEmpty) {
          return [];
      }
      var yamlText = readLines(path).join('\n');
      yamlText = yamlText.replace(/(!expr )(.*)\n/g, '$2\n');
      return jsYaml$1.safeLoad(yamlText);
  };

  function objectWithoutProperties$6 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  var pinString = function (x, opts) {
      if ( opts === void 0 ) opts = {
      name: null,
      description: null,
      board: null
  };

      var name = opts.name;
      var description = opts.description;
      var board = opts.board;
      var rest = objectWithoutProperties$6( opts, ["name", "description", "board"] );
      var args = rest;
      var paths = ensure(x);
      var extension = paths.length > 0 ? 'zip' : tools.fileExt(paths);
      return boardPinStore(board, Object.assign.apply(Object, [ {}, {
          name: name,
          description: description,
          path: paths,
          type: 'files',
          metadata: {
              extension: extension
          }
      } ].concat( args )));
  };
  var pinFileCacheMaxAge = function (cacheControl) {
      if (!cacheControl) 
          { return null; }
      var maxAge = new RegExp('max-age').test(cacheControl);
      if (maxAge.length !== 1) 
          { return null; }
      maxAge = cacheControl.replace(/.*max-age=/, '');
      return parseFloat(maxAge.replace(/,.*$/, ''));
  };

  function objectWithoutProperties$7 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  var pinDownloadOne = function (path$1, ref) {
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
      var fetch$1, mustDownload, localPath, tempfile$1, oldPin, oldCache, oldCacheMissing, cacheIndex, error, newCache, files, relativePath;
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
      oldPin = pinRegistryRetrieveMaybe(name, component);
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
      cache = {};
      cache.etag = oldCache.etag || '';
      cache.maxAge = oldCache.maxAge || 0;
      cache.changeAge = oldCache.changeAge || new Date().getTime() - cache.maxAge;
      cache.url = path$1;
      error = null;
      pinLog(("Checking 'changeAge' header (time, change age, max age): " + (new Date()) + ", " + (cache.changeAge) + ", " + (cache.maxAge)));
      details.somethingChanged = false;
      if (new Date().getTime() >= cache.changeAge + cache.maxAge || mustDownload) {
          var etagChanged;
          if (customEtag && customEtag.length) {
              pinLog(("Using custom 'etag' (old, new): " + (oldCache.etag) + ", " + customEtag));
              cache.etag = customEtag;
              return $If_2.call(this);
          } else {
              var headResult;
              return fetch$1(path$1, {
                  method: 'HEAD'
              }).then((function ($await_5) {
                  try {
                      headResult = $await_5;
                      if (headResult) {
                          cache.etag = headResult.headers.etag;
                          cache.maxAge = pinFileCacheMaxAge(headResult.headers['cache-control']);
                          cache.changeAge = new Date().getTime();
                          contentLength = headResult.headers['content-length'];
                          pinLog(("Checking 'etag' (old, new):  " + (oldCache.etag) + ", " + (cache.etag)));
                      }
                      return $If_2.call(this);
                  } catch ($boundEx) {
                      return $error($boundEx);
                  }
              }).bind(this), $error);
          }
          function $If_2() {
              etagChanged = cache.etag || oldCache.etag !== cache.etag;
              if (oldCacheMissing || etagChanged || mustDownload) {
                  var downloadName, destinationPath, result;
                  downloadName = basename(path$1);
                  destinationPath = path(tempfile$1, downloadName);
                  pinLog(("Downloading " + path$1 + " to " + destinationPath));
                  details.somethingChanged = true;
                  return fetch$1(path$1).then(function (response) {
                      if (!response.ok) {
                          pinLog(("Failed to download remote file: " + path$1));
                      }
                      return response;
                  }).then((function ($await_6) {
                      try {
                          result = $await_6;
                          if (result.ok) {
                              var contentType, text;
                              contentType = result.headers['content-type'];
                              return result.text().then((function ($await_7) {
                                  try {
                                      text = $await_7;
                                      write(text, destinationPath);
                                      return $If_4.call(this);
                                  } catch ($boundEx) {
                                      return $error($boundEx);
                                  }
                              }).bind(this), $error);
                          }
                          function $If_4() {
                              return $If_3.call(this);
                          }
                          
                          return $If_4.call(this);
                      } catch ($boundEx) {
                          return $error($boundEx);
                      }
                  }).bind(this), $error);
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
              extract = true;
          }
          files = dir.list(tempfile$1, {
              fullNames: true
          });
          files.forEach(function (file) {
              copy(file, localPath, {
                  overwrite: true,
                  recursive: true
              });
          });
          relativePath = localPath.replace(pinStoragePath(component, ''), '');
          return $return(localPath);
      }
      
      return $If_1.call(this);
  });
  };
  var pinDownload$1 = function (path, ref) {
      var rest = objectWithoutProperties$7( ref, [] );
      var args = rest;

      return new Promise(function ($return, $error) {
      var localPath;
      return pinDownloadOne(path, args).then(function ($await_8) {
          try {
              localPath = $await_8;
              return $return(localPath);
          } catch ($boundEx) {
              return $error($boundEx);
          }
      }, $error);
  });
  };

  function objectWithoutProperties$8 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  var datatxtRefreshIndex = function (board) { return new Promise(function ($return, $error) {
      var indexFile, indexUrl, fetch$1, data, tempfile$1, localIndex, currentIndex, newIndex, yamlText;
      if (!board.url) {
          return $error(new Error(("Invalid 'url' in '" + (board.name) + "' board.")));
      }
      indexFile = 'data.txt';
      if (board.indexRandomize) {
          indexFile += "?rand=" + (Math.round(Math.random() * 1e8));
      }
      indexUrl = path(board.url, indexFile);
      fetch$1 = fetch();
      return fetch$1(indexUrl).then(function (response) {
          if (!response.ok && board.needsIndex) {
              throw new Error(("Failed to retrieve data.txt file from " + (board.url) + "."));
          } else {
              return response.text();
          }
      }).then(function ($await_1) {
          try {
              data = $await_1;
              tempfile$1 = tempfile();
              dir.create(tempfile$1);
              write(data, tempfile$1);
              localIndex = path(boardLocalStorage(board), 'data.txt');
              currentIndex = boardManifestGet(localIndex, true);
              newIndex = boardManifestGet(tempfile$1);
              newIndex = newIndex.map(function (newEntry) {
                  var currentEntry = currentIndex.filter(function (ci) { return ci.path === newEntry.path; });
                  if (currentEntry.length == 1) {
                      newEntry.cache = currentEntry[0].cache;
                  }
                  return newEntry;
              });
              currentIndex = newIndex;
              yamlText = jsYaml$1.safeDump(currentIndex);
              writeLines(localIndex, yamlText.split('\n'));
              return $return();
          } catch ($boundEx) {
              return $error($boundEx);
          }
      }, $error);
  }); };
  var datatxtPinDownloadInfo = function (board, name, args) {
      var index = boardManifestGet(path(boardLocalStorage(board), 'data.txt'));
      index = index.filter(function (v) { return v.name === name; });
      if (!index.length && board.needsIndex) {
          throw new Error(("Could not find '" + name + "' pin in '" + (board.name) + "' board."));
      }
      var indexEntry = null;
      if (index.length) {
          indexEntry = index[0];
      } else {
          indexEntry = [{
              path: name
          }];
      }
      var pathGuess = new RegExp('.*/.*\\.[a-zA-Z]+$').test(indexEntry.path) ? dirname(indexEntry.path) : indexEntry.path;
      pathGuess = new RegExp('^https?://').test(pathGuess) ? pathGuess : path(board.url, pathGuess);
      return {
          pathGuess: pathGuess,
          indexEntry: indexEntry
      };
  };
  var datatxtRefreshManifest = function (board, name, download, args) { return new Promise(function ($return, $error) {
      var assign;

      var pathGuess, indexEntry, downloadPath;
      ((assign = datatxtPinDownloadInfo(board, name), pathGuess = assign.pathGuess, indexEntry = assign.indexEntry));
      downloadPath = path(pathGuess.slice(0, -6), 'data.txt');
      return pinDownload$1(downloadPath, {
          name: name,
          component: board,
          canFail: true,
          download: download
      }).then(function ($await_2) {
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
  }); };
  var boardInitializeDatatxt = function (board, args) { return new Promise(function ($return, $error) {
      var assign, rest;

      var url, browseUrl, headers, bucket, indexUpdated, indexRandomize, needsIndex, cache, params;
      ((assign = args, url = assign.url, browseUrl = assign.browseUrl, headers = assign.headers, bucket = assign.bucket, indexUpdated = assign.indexUpdated, indexRandomize = assign.indexRandomize, indexRandomize = indexRandomize === void 0 ? false : indexRandomize, needsIndex = assign.needsIndex, needsIndex = needsIndex === void 0 ? true : needsIndex, cache = assign.cache, cache = cache === void 0 ? boardCachePath() : cache, rest = objectWithoutProperties$8( assign, ["url", "browseUrl", "headers", "bucket", "indexUpdated", "indexRandomize", "needsIndex", "cache"] ), params = rest));
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
      return datatxtRefreshIndex(board).then(function ($await_3) {
          try {
              return $return(board);
          } catch ($boundEx) {
              return $error($boundEx);
          }
      }, $error);
  }); };
  var boardPinGetDatatxt = function (board, name, args) { return new Promise(function ($return, $error) {
      var assign, rest;

      var extract, version, download, opts, manifestPaths, indexEntry, downloadPath, localPath, manifest;
      ((assign = args, extract = assign.extract, version = assign.version, download = assign.download, download = download === void 0 ? true : download, rest = objectWithoutProperties$8( assign, ["extract", "version", "download"] ), opts = rest));
      return datatxtRefreshManifest(board, name, download).then(function ($await_4) {
          var assign;

          try {
              manifestPaths = $await_4;
              ((assign = manifestPaths, indexEntry = assign.indexEntry));
              downloadPath = manifestPaths.downloadPath;
              localPath = pinStoragePath(board, name);
              manifest = pinManifestGet(localPath);
              if (version) {}
              if (manifest) {
                  downloadPath = indexEntry.path;
                  var pinManifest;
                  pinManifest = pinManifestDownload(localPath);
                  if (pinManifest) {
                      downloadPath = '';
                      if (new Regexp('^https?://').test(pinManifest)) {
                          downloadPath = pinManifest;
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
              return pinDownload$1(downloadPath, {
                  name: name,
                  component: board,
                  extract: extract,
                  download: download
              }).then(function ($await_5) {
                  try {
                      localPath = $await_5;
                      return $return(localPath);
                  } catch ($boundEx) {
                      return $error($boundEx);
                  }
              }, $error);
          } catch ($boundEx) {
              return $error($boundEx);
          }
      }, $error);
  }); };
  var boardPinFindDatatxt = function (board, text, args) { return new Promise(function ($return, $error) {
      var entries;
      return datatxtRefreshIndex(board).then(function ($await_6) {
          try {
              entries = boardManifestGet(path(boardLocalStorage(board), 'data.txt'));
              if (extended) {
                  return $return(null);
              }
              console.log(entries);
              return $return();
          } catch ($boundEx) {
              return $error($boundEx);
          }
      }, $error);
  }); };

  function objectWithoutProperties$9 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  var pinLoadFiles = function (path, ref) {
      var rest = objectWithoutProperties$9( ref, [] );

      var files = dir.list(path, {
          recursive: true,
          fullNames: true
      });
      var result = files.filter(function (e) { return !/data\.txt$/g.test(e); });
      return result;
  };

  function readCsv(strData, strDelimiter) {
      strDelimiter = strDelimiter || ',';
      var objPattern = new RegExp('(\\' + strDelimiter + '|\\r?\\n|\\r|^)' + '(?:"([^"]*(?:""[^"]*)*)"|' + '([^"\\' + strDelimiter + '\\r\\n]*))', 'gi');
      var arrData = [[]];
      var arrMatches = null;
      while (arrMatches = objPattern.exec(strData)) {
          var strMatchedDelimiter = arrMatches[1];
          if (strMatchedDelimiter.length && strMatchedDelimiter != strDelimiter) {
              arrData.push([]);
          }
          if (arrMatches[2]) {
              var strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"');
          } else {
              var strMatchedValue = arrMatches[3];
          }
          arrData[arrData.length - 1].push(strMatchedValue);
      }
      return arrData;
  }

  var pinsSaveCsv = function (x, name) {
      if (x.length > 0) {
          var columns = Object.keys(x[0]).join(',');
          writeLines(name, columns);
      }
      var rows = x.map(function (row) { return Object.keys(row).map(function (key) { return row[key]; }).join(','); });
      writeLines(name, rows);
  };
  var pinsSafeCsv = function (x, name) {
      try {
          return pinsSaveCsv(x, name);
      } catch (e) {
          pinLog('Failed to save data frame as CSV file: ' + e);
      }
  };

  function objectWithoutProperties$a (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  var pinDataFrame = function (x, opts) {
      if ( opts === void 0 ) opts = {
      name: null,
      description: null,
      board: null
  };

      var name = opts.name;
      var description = opts.description;
      var board = opts.board;
      var rest = objectWithoutProperties$a( opts, ["name", "description", "board"] );
      var args = rest;
      if (isNull(name)) 
          { name = pinDefaultName(x, board); }
      var path$1 = tempfile();
      dir.create(path$1);
      write(JSON.stringify(x), path(path$1, 'data.json'));
      pinsSafeCsv(x, path(path$1, 'data.csv'));
      return onExit(function () { return unlink(path$1); }, function () {
          var columns = dfColNames(x);
          var metadata = {
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
          } ].concat( args )));
      });
  };
  var pinLoadTable = function (path$1) {
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
  };

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
  registerMethod('boardPinGet', 'datatxt', boardPinGetDatatxt);
  registerMethod('boardPinFind', 'datatxt', boardPinFindDatatxt);

  exports.boardConnect = boardConnect;
  exports.boardDeregister = boardDeregister;
  exports.boardDisconnect = boardDisconnect;
  exports.boardGet = boardGet;
  exports.boardList = boardList;
  exports.boardRegister = boardRegister;
  exports.callbacks = callbacks;
  exports.pin = pin;
  exports.pinFetch = pinFetch$1;
  exports.pinFind = pinFind;
  exports.pinGet = pinGet;
  exports.pinInfo = pinInfo;
  exports.pinLoad = pinLoad;
  exports.pinPreview = pinPreview;
  exports.pinRemove = pinRemove;
  exports.pinVersions = pinVersions;

  return exports;

}({}));
//# sourceMappingURL=pins.js.map
