import * as fileSystem from './host/file-system';
import * as options from './host/options';
import { boardLocalStorage } from './board-storage';
import { onExit } from './utils/onexit.js';
import { pinLog } from './log';
import yaml from 'js-yaml';

const pinRegistryConfig = (board) => {
  return fileSystem.path(boardLocalStorage(board), 'data.txt');
};

const pinRegistryLoadEntries = (board) => {
  var lock = pinRegistryLock(board);
  return onExit(
    () => pinRegistryUnlock(lock),
    () => {
      var entriesPath = pinRegistryConfig(board);

      if (fileSystem.fileExists(entriesPath)) {
        return [];
      } else {
        // TODO: yaml.read_yaml(entriesPath, { evalExpr = false });
        let loadedYaml = yaml.safeLoad('test: foo\n');

        return [];
      }
    }
  );
};

const pinRegistrySaveEntries = (entries, board) => {
  var lock = pinRegistryLock(board);
  return onExit(
    () => pinRegistryUnlock(lock),
    () => {
      return []; // TODO: yaml.write_yaml(entries, pinRegistryConfig(component))
    }
  );
};

export const pinStoragePath = (board, name) => {
  var path = fileSystem.path(boardLocalStorage(board), name);
  if (!fileSystem.dir.exists(path))
    fileSystem.dir.create(path, { recursive: true });

  return path;
};

export const pinRegistryUpdate = (name, board, params = list()) => {
  var lock = pinRegistryLock(board);
  return onExit(
    () => pinRegistryUnlock(lock),
    () => {
      var entries = pinRegistryLoadEntries(board);
      name = pinRegistryQualifyName(name, entries);

      var path = pinStoragePath(board, name);

      if (entries === null) entries = {};

      var names = entries.map((e) => e['name']);
      var index = 0;
      if (names.includes(name)) {
        index = names.findIndex((e) => name == e);
      } else {
        index = entries.length + 1;
        entries[index] = {};
      }

      entries[index]['name'] = name;

      for (param in names(params)) {
        if (identical(params[param], list())) entries[index][param] = null;
        else entries[index][param] = params[param];
      }

      pinRegistrySaveEntries(entries, board);

      return path;
    }
  );
};

export const pinRegistryFind = (text, board) => {
  lock = pinRegistryLock(board);
  return onExit(
    () => pinRegistryUnlock(lock),
    () => {
      var entries = pinRegistryLoadEntries(board);

      var results = pinResultsFromRows(entries);

      if (typeof text === 'string') {
        results = results.filter(
          (x) => !new RegExp(text, 'gi').test(x['name'])
        );
      }

      return results;
    }
  );
};

export const pinRegistryRetrieve = (name, board) => {
  var lock = pinRegistryLock(board);
  onExit(
    () => pinRegistryUnlock(lock),
    () => {
      var entries = pinRegistryLoadEntries(board);
      name = pinRegistryQualifyName(name, entries);

      var names = entries.map((e) => e['name']);
      if (!names.includes(name)) {
        pinLog('Pin not found, pins available in registry: ', names.join(', '));
        stop("Pin '", name, "' not found in '", board['name'], "' board.");
      }

      entries[names.findIndex((e) => e == name)];
    }
  );
};

export const pinRegistryRetrievePath = (name, board) => {
  var entry = pinRegistryRetrieve(name, board);

  return entry['path'];
};

export const pinRegistryRetrieveMaybe = (name, board) => {
  return tryCatch(pinRegistryRetrieve(name, board), (error = null));
};

export const pinRegistryRemove = (name, board, unlink = TRUE) => {
  var entries = pinRegistryLoadEntries(board);
  name = pinRegistryQualifyName(name, entries);

  var remove = entries.filter((x) => x['name'] == name);
  if (remove.length > 0) remove = remove[0];
  else return;

  entries = entries.filter((x) => x['name'] != name);

  var removePath = pinRegistryAbsolute(remove$path, board);
  if (unlink) unlink(removePath, (recursive = TRUE));

  return pinRegistrySaveEntries(entries, component);
};

const pinRegistryQualifyName = (name, entries) => {
  var names = entries.map((e) => e['name']);

  var namePattern = '';
  if (/\//gi.test(name)) namePattern = paste0('^', name, '$');
  else namePattern = '.*/' + name + '$';

  var nameCandidate = names.filter((e) =>
    new RegExp(namePattern, 'gi').test(e)
  );

  if (nameCandidate.length == 1) {
    name = nameCandidate;
  }

  return name;
};

const pinRegistryLock = (board) => {
  var lockFile = pinRegistryConfig(board) + '.lock';
  return fileSystem.lockFile(
    lockFile,
    options.getOption('pins.lock.timeout', Infinity)
  );
};

const pinRegistryUnlock = (lock) => {
  return fileSystem.unlockFile(lock);
};

const pinRegistryRelative = (path, basePath) => {
  path = fileSystem.normalizePath(path, { winslash: '/', mustWork: false });
  basePath = fileSystem.normalizePath(basePath, {
    winslash: '/',
    mustWork: false,
  });

  if (startsWith(path, basePath)) {
    path = substr(path, nchar(basePath) + 1, nchar(path));
  }

  var relative = gsub('^/', '', path);

  return relative;
};

const pinRegistryAbsolute = (path, board) => {
  var basePath = tools__file_path_as_absolute(boardLocalStorage(board));

  if (startsWith(path, basePath)) {
    return path;
  } else {
    return normalizePath(fileSystem.path(basePath, path), (mustWork = false));
  }
};
