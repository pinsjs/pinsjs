import * as options from './host/options';
import * as arrays from './utils/arrays';
import callbacks from './host/callbacks';
import * as ui from './ui-viewer';
import * as boardRegistry from './board-registry';
import { boardCachePath } from './board-registration';
import { boardInitialize } from './board-extensions';
import { pinLog, pinDebug } from './log';
import * as checks from './utils/checks';
import { boardDefault } from './board-default';

async function newBoard(board, name, cache, versions, ...args) {
  if (cache == null) throw new Error("Please specify the 'cache' parameter.");

  board = {
    board: board,
    name: name,
    cache: cache,
    versions: versions,
    class: board,
  };

  board = await boardInitialize(
    board,
    Object.assign({ cache, versions }, ...args)
  );

  return board;
}

function boardInfer(x, { name, board, registerCall, connect, url }) {
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
      // inferred$name <- gsub("https?://|\\..*", "", inferred$url)
      inferred['name'] = inferred['url']
        .replace(/https?:\/\//g, '')
        .replace(/\..*$/g, '');
    }

    inferred['registerCall'] =
      'pins::board_register(board = "datatxt", name = "' +
      inferred['name'] +
      '", url = "' +
      inferred['url'] +
      '")';
  }

  if (inferred['name'] == null) inferred['name'] = x;
  if (inferred['board'] == null) inferred['board'] = x;

  return inferred;
}

function boardRegisterCode(board, name) {
  return callbacks.get('boardRegisterCode')(board, name);
}

export function boardConnect(board, code, ...args) {
  var board = boardGet(board);

  ui.uiViewerRegister(board, code);

  return board;
}

export function boardDisconnect(name, args) {
  const board = boardGet(name);

  ui.uiViewerClose(board);

  return board;
}

/**
 * Retrieves all available boards.
 *
 * @return {Object}                      All the names from the registered boards.
 *
 * @example
 * ````multilang
 * ```js
 * pins.boardList();
 * ```
 * ```py
 * pins.board_list()
 * ```
 * ````
 */
export function boardList() {
  var defaults = arrays.concat(['local'], boardDefault());
  var boards = arrays.concat(boardRegistry.list(), defaults);

  return arrays.unique(boards);
}

export function boardGet(name) {
  if (checks.isNull(name)) {
    name = boardDefault();
  }

  var registerCall = 'pins::board_register(board = "' + name + '")';

  if (!boardRegistry.list().includes(name)) {
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
      pinLog(`Failed to register board ${name}: ${err.toString()}`);
    }

    if (!boardRegistry.list().includes(name)) {
      throw `Board '${name}' not a board, available boards: ${boardList().join(
        ', '
      )}`;
    }
  }

  return boardRegistry.get(name);
}

/**
 * Registers a board, useful to find resources with `pinFind()` or pin to additional boards with `pin()`.
 *
 * @param  {String}    board             The name of the board to register.
 * @param  {String}    name              An optional name to identify this board, defaults to the board name.
 * @param  {String}    cache             The local folder to use as a cache.
 * @param  {Boolean}   versions          Should this board be registered with support for versions?
 *
 * @return {String}                      The name of the board.
 *
 * @example
 * ````multilang
 * ```js
 * pins.boardRegister("s3", {
 *   bucket: "bucket",
 *   key: "key",
 *   secret: "secret"
 * });
 * ```
 * ```py
 * pin = pins.board_register("s3", bucket = "bucket", key = "key", secret = "secrert")
 * ```
 * ````
 */
export async function boardRegister(board, { name, cache, versions, ...args }) {
  if (name == null) name = board;
  if (cache == null) cache = boardCachePath();

  var inferred = boardInfer(board, {
    board: board,
    name: name,
    registerCall: args['registerCall'],
    connect: args['connect'],
    url: args['url'],
  });

  args['url'] = inferred['url'];
  board = await newBoard(
    inferred['board'],
    inferred['name'],
    cache,
    versions,
    args
  );

  boardRegistry.set(inferred['name'], board);

  if (inferred['registerCall'] == null)
    inferred['registerCall'] = boardRegisterCode(
      board['name'],
      inferred['name']
    );

  if (inferred['connect'] !== false)
    boardConnect(board['name'], inferred['registerCall']);

  return inferred['name'];
}

export function boardDeregister(name, args = {}) {
  if (!boardRegistry.list().includes(name)) {
    throw `Board '${name}' is not registered`;
  }

  const board = boardGet(name);

  if (args.disconnect) {
    boardDisconnect(name);
  }

  boardRegistry.remove(name);

  return null;
}
