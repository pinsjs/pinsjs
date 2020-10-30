import * as fileSystem from './host/file-system';
import * as options from './host/options';
import { boardLocalStorage } from './board-storage';
import { onExit } from './utils/onexit';
import { pinLog } from './log';
import yaml from 'js-yaml';
import { pinResultsFromRows } from './pin-tools';
import * as checks from './utils/checks';
import * as errors from './utils/errors';

function pinRegistryConfig(board) {
  return fileSystem.path(boardLocalStorage(board), 'data.txt');
}

async function pinRegistryLoadEntries(board) {
  const lock = pinRegistryLock(board);

  return await onExit(
    () => pinRegistryUnlock(lock),
    () => {
      var entriesPath = pinRegistryConfig(board);

      if (!fileSystem.fileExists(entriesPath)) {
        return [];
      } else {
        let yamlText = fileSystem.readLines(entriesPath).join('\n');
        let loadedYaml = yaml.safeLoad(yamlText);
        return loadedYaml;
      }
    }
  );
}

async function pinRegistrySaveEntries(entries, board) {
  var lock = pinRegistryLock(board);
  return await onExit(
    () => pinRegistryUnlock(lock),
    () => {
      let yamlText = yaml.safeDump(entries);
      fileSystem.writeLines(pinRegistryConfig(board), yamlText.split('\n'));
    }
  );
}

export function pinStoragePath(board, name) {
  var path = fileSystem.path(boardLocalStorage(board), name);

  if (!fileSystem.dir.exists(path)) {
    fileSystem.dir.create(path, { recursive: true });
  }

  return path;
}

export async function pinRegistryUpdate(name, board, params = {}) {
  var lock = pinRegistryLock(board);

  return await onExit(
    () => pinRegistryUnlock(lock),
    async () => {
      var entries = await pinRegistryLoadEntries(board);

      name = pinRegistryQualifyName(name, entries);

      var path = pinStoragePath(board, name);

      if (entries === null) entries = [];

      var names = entries.map((e) => e.name);
      var index = 0;

      if (names.includes(name)) {
        index = names.findIndex((e) => e === name);
      } else {
        index = entries.length;
        entries[index] = {};
      }

      entries[index]['name'] = name;

      for (var param in params) {
        if (
          (Array.isArray(params[param]) && !params[param].length) ||
          typeof params[param] === 'undefined'
        ) {
          delete entries[index][param];
        } else {
          entries[index][param] = params[param];
        }
      }

      await pinRegistrySaveEntries(entries, board);

      return path;
    }
  );
}

export async function pinRegistryFind(text, board) {
  var lock = pinRegistryLock(board);

  return await onExit(
    () => pinRegistryUnlock(lock),
    async () => {
      var entries = await pinRegistryLoadEntries(board);
      var results = pinResultsFromRows(entries);

      if (typeof text === 'string' && text.length > 0) {
        results = results.filter((x) => new RegExp(text, 'gi').test(x['name']));
      }

      return results;
    }
  );
}

export async function pinRegistryRetrieve(name, board) {
  var lock = pinRegistryLock(board);

  return await onExit(
    () => pinRegistryUnlock(lock),
    async () => {
      var entries = await pinRegistryLoadEntries(board);
      name = pinRegistryQualifyName(name, entries);

      var names = entries.map((e) => e.name);
      if (!names.includes(name)) {
        pinLog(
          `Pin not found, pins available in registry: ${names.join(', ')}`
        );
        throw new Error(`Pin '${name}' not found in '${board.name}' board.`);
      }

      return entries.find((e) => e.name === name);
    }
  );
}

export async function pinRegistryRetrievePath(name, board) {
  var entry = await pinRegistryRetrieve(name, board);

  return entry['path'];
}

export async function pinRegistryRetrieveMaybe(name, board) {
  return await errors.tryCatchNull(
    async () => await await pinRegistryRetrieve(name, board)
  );
}

export async function pinRegistryRemove(name, board, unlink = true) {
  var entries = await pinRegistryLoadEntries(board);
  name = pinRegistryQualifyName(name, entries);

  var remove = entries.filter((x) => x.name === name);
  if (remove.length > 0) remove = remove[0];
  else return;

  entries = entries.filter((x) => x.name !== name);

  var removePath = pinRegistryAbsolute(remove.path, board);
  if (unlink) fileSystem.dir.remove(removePath, { recursive: true });

  return await pinRegistrySaveEntries(entries, board);
}

function pinRegistryQualifyName(name, entries) {
  var names = entries.map((e) => e.name);
  var namePattern = '';

  if (new RegExp(/\//g).test(name)) {
    namePattern = `^${name}$`;
  } else {
    namePattern = `.*/${name}$`;
  }

  var nameCandidate = names.filter((e) =>
    new RegExp(namePattern, 'gi').test(e)
  );

  if (nameCandidate.length === 1) {
    name = nameCandidate;
  }

  return name;
}

function pinRegistryLock(board) {
  var lockFile = pinRegistryConfig(board) + '.lock';

  return fileSystem.lockFile(
    lockFile,
    options.getOption('pins.lock.timeout', Infinity)
  );
}

function pinRegistryUnlock(lock) {
  return fileSystem.unlockFile(lock);
}

export function pinRegistryRelative(path, basePath) {
  path = fileSystem.normalizePath(path, { winslash: '/', mustWork: false });
  basePath = fileSystem.normalizePath(basePath, {
    winslash: '/',
    mustWork: false,
  });

  if (path.startsWith(basePath)) {
    path = path.substr(basePath.length + 1, path.length);
  }

  var relative = path.replace('^/', '');

  return relative;
}

export function pinRegistryAbsolute(path, board) {
  var basePath = fileSystem.absolutePath(boardLocalStorage(board));

  if (path.startsWith(basePath)) {
    return path;
  } else {
    return fileSystem.normalizePath(fileSystem.path(basePath, path), {
      mustWork: false,
    });
  }
}

export async function pinResetCache(board, name) {
  // clean up name in case it's a full url
  const sanitizedName = name.replace(/^https?:\/\//g, '');
  const index = await errors.tryCatchNull(
    async () => (await pinRegistryRetrieve(sanitizedName, board)) || null
  );

  if (!checks.isNull(index)) {
    index.cache = {};
    await pinRegistryUpdate(sanitizedName, board, { params: index });
  }
}
