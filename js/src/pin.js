import { useMethod, useMethodAsync } from './utils/inheritance';
import * as checks from './utils/checks';
import { boardGet, boardList } from './board';
import { pinResetCache } from './pin-registry';
import {
  boardPinGet,
  boardPinFind,
  boardPinRemove,
  boardPinVersions,
  boardEmptyResults,
} from './board-extensions';
import { uiViewerUpdated } from './ui-viewer';
import { pinManifestGet } from './pin-manifest';
import * as arrays from './utils/arrays';
import { pinVersionsPathName, boardVersionsShorten } from './versions';
import * as fileSystem from './host/file-system';
import { pinContentName, pinResultsMerge } from './pin-tools';
import { dataFrame, dfCBind, dfColRemove } from './utils/dataframe';
import { pinLog, pinDebug } from './log';

export const pin = async (x, ...args) => {
  pinDebug('pin', Object.assign({ x: x }, ...args));
  return arrays.maybeOne(await useMethodAsync('pin', x, ...args));
};

export const pinGet = async (
  name,
  { board, cache, extract, version, files, signature, ...args }
) => {
  if (checks.isNull(board)) {
    var boardPinGetOrNull = async (...args) => {
      try {
        return await boardPinGet(...args);
      } catch (err) {
        return null;
      }
    };

    var result = await boardPinGetOrNull(boardGet(null), name, {
      version: version,
    });

    if (checks.isNull(result) && checks.isNull(board)) {
      for (var boardName in boardList()) {
        if (!cache) pinResetCache(boardName, name);
        result = await boardPinGetOrNull(boardGet(boardName), name, {
          extract: extract,
          version: version,
        });
        if (!checks.isNull(result)) {
          pinLog('Found pin ' + name + ' in board ' + boardName);
          break;
        }
      }
    }
    if (checks.isNull(result))
      throw new Error("Failed to retrieve '" + name + "' pin.");
  } else {
    if (!cache) pinResetCache(board, name);
    result = await boardPinGet(
      boardGet(board),
      name,
      Object.assign({ extract: extract, version: version }, ...args)
    );
  }

  var manifest = pinManifestGet(result);
  if (checks.isNull(manifest['type'])) manifest['type'] = 'files';

  var resultFiles = arrays
    .ensure(result)
    .filter((e) => !new RegExp('^' + pinVersionsPathName()).test(e));
  resultFiles = fileSystem.dir.list(resultFiles, { fullNames: true });
  if (manifest['type'] == 'files' && resultFiles.length > 1)
    resultFiles = resultFiles.filter((e) => !/\/data\.txt$/g.test(e));

  if (!checks.isNull(signature)) {
    var pinSignature = pinVersionSignature(resultFiles);
    if (signature !== pin_signature)
      throw new Error(
        "Pin signature '" + pin_signature + "' does not match given signature."
      );
  }

  if (files) {
    return arrays.maybeOne(resultFiles);
  } else {
    return pinLoad({ _content: result, class: manifest['type'] });
  }
};

export const pinRemove = (name, board) => {
  board = boardGet(board);

  boardPinRemove(board, name);
  uiViewerUpdated(board);

  return null;
};

const pinFindEmpty = () => {
  return dataFrame(null, {
    name: 'character',
    description: 'character',
    type: 'character',
    metadata: 'character',
    board: 'character',
  });
};

export const pinFind = async (
  text,
  { board, name, extended, metadata, ...args }
) => {
  if (checks.isNull(board) || board.length == 0) board = boardList();

  text = pinContentName(text);
  if (checks.isNull(text) && !checks.isNull(name)) text = name;

  var allPins = pinFindEmpty();

  board = arrays.ensure(board);
  for (var boardIdx in board) {
    var boardName = board[boardIdx];
    var boardObject = boardGet(boardName);

    var boardPins = null;
    try {
      boardPins = await boardPinFind(
        boardObject,
        text,
        Object.assign({ name: name, extended: extended }, ...args)
      );
    } catch (error) {
      pinLog("Error searching '" + boardName + "' board: " + error);
      boardPins = boardEmptyResults();
    }

    if (extended === true) {
      boardPins = boardPins.map((row) => {
        if (row.hasOwnProperty('metadata')) {
          Object.assign(row, row['metadata']);
          delete row['metadata'];
        }
        return row;
      });
    }

    if (boardPins.length > 0) {
      boardPins = dfCBind(
        boardPins,
        dataFrame(
          boardPins.map((e) => Object.assign(e, { board: boardName })),
          { board: 'character' }
        )
      );

      allPins = pinResultsMerge(allPins, boardPins, extended === true);
    }
  }

  if (!checks.isNull(text)) {
    allPins = allPins.filter(
      (e) =>
        e['name'] == text ||
        (checks.isNull(e['description'])
          ? false
          : new RegExp(text, 'i').test(e['description']))
    );
  }

  if (!metadata) {
    allPins = dfColRemove(allPins, 'metadata');
  }

  if (!checks.isNull(name)) {
    allPins = allPins.filter((e) =>
      new RegExp('(.*/)?' + name + '$').test(e['name'])
    );
    if (allPins.length > 0) allPins = allPins.filter((e, idx) => idx === 0);
  }

  // sort pin results by name
  allPins = allPins.sort((a, b) => a['name'] < a['name']);

  return allPins;
};

export const pinPreview = (x, ...args) => {
  return useMethod('pinPreview', x, ...args);
};

export const pinLoad = (path, ...args) => {
  return useMethod('pinLoad', path, ...args);
};

const pinFiles = async (name, { board, ...args }) => {
  var entry = await pinFind({ name: name, board: board, metadata: true });

  if (entry.length != 1) throw new Error("Pin '" + name + "' not found.");
  var metadata = entry[0]['metadata'];

  return metadata[path];
};

const pinGetOne = async (name, board, extended, metadata) => {
  // first ensure there is always one pin since metadata with multiple entries can fail
  var entry = await pinFind(null, {
    name: name,
    board: board,
    metadata: false,
    extended: false,
  });

  if (entry.length == 0) throw new Error("Pin '" + name + "' was not found.");
  if (entry.length > 1)
    throw new Error(
      "Pin '" +
        name +
        "' was found in multiple boards: " +
        entry['board'].join(',') +
        '.'
    );

  board = entry[0]['board'];
  entry = await pinFind(null, {
    name: name,
    board: board,
    metadata: metadata,
    extended: extended,
  });

  return entry[0];
};

export const pinInfo = async (
  name,
  { board, extended, metadata, signature, ...args }
) => {
  var entry = await pinGetOne(name, board, extended, metadata);

  var board = entry['board'];

  metadata = [];
  if (
    Object.keys(entry).includes('metadata') &&
    entry.metadata.columns.length > 0
  ) {
    metadata = entry['metadata'];
  }

  if (signature) {
    var files = await pinGet(name, { board: board, files: true });
    entry['signature'] = pinVersionSignature(files);
  }

  var entryExt = Object.assign(entry);
  delete entryExt['metadata'];

  [...Object.keys(entryExt)].forEach((key) => {
    const filtered =
      !(entryExt[key] instanceof Array) ||
      entryExt[key].length != 1 ||
      !(entryExt[key][0] instanceof Array) ||
      entryExt[key][0].length > 0;

    if (!filtered) {
      delete entryExt[key];
    }
  });

  for (name in metadata) {
    entryExt[name] = metadata[name];
  }

  return Object.assign(entryExt, { class: 'pin_info' });
};

export const pinFetch = (...args) => {
  return useMethod('pinFetch', ...args);
};

export const pinVersions = (name, { board, full = false, ...args }) => {
  var versions = boardPinVersions(boardGet(board), name);

  if (!full) {
    versions['version'] = boardVersionsShorten(versions['version']);
  }

  return versions;
};
