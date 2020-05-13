import * as fileSystem from './host/file-system';
import * as options from './host/options';
import { boardLocalStorage } from './board-storage';
import { onExit } from './utils/onexit.js';
import { pinLog } from './log';
import yaml from 'js-yaml';

const pinRegistryConfig = (component) => {
  return fileSystem.path(boardLocalStorage(component), 'data.txt');
};

const pinRegistryLoadEntries = (component) => {
  var lock = pinRegistryLock(component);
  return onExit(
    () => pinRegistryUnlock(lock),
    () => {
      var entriesPath = pinRegistryConfig(component);

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

const pinRegistrySaveEntries = (entries, component) => {
  var lock = pinRegistryLock(component);
  return onExit(
    () => pinRegistryUnlock(lock),
    () => {
      return []; // TODO: yaml.write_yaml(entries, pinRegistryConfig(component))
    }
  );
};

const pinStoragePath = (component, name) => {
  var path = fileSystem.path(boardLocalStorage(component), name);
  if (!dir.exists(path)) dir.create(path, (recursive = true));

  return path;
};

export const pinRegistryUpdate = (name, component, params = list()) => {
  var lock = pinRegistryLock(component);
  return onExit(
    () => pinRegistryUnlock(lock),
    () => {
      var entries = pinRegistryLoadEntries(component);
      name = pinRegistryQualifyName(name, entries);

      var path = pinStoragePath(component, name);

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

      pinRegistrySaveEntries(entries, component);

      return path;
    }
  );
};

export const pinRegistryFind = (text, component) => {
  lock = pinRegistryLock(component);
  return onExit(
    () => pinRegistryUnlock(lock),
    () => {
      var entries = pinRegistryLoadEntries(component);

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

export const pinRegistryRetrieve = (name, component) => {
  var lock = pinRegistryLock(component);
  onExit(
    () => pinRegistryUnlock(lock),
    () => {
      var entries = pinRegistryLoadEntries(component);
      name = pinRegistryQualifyName(name, entries);

      var names = entries.map((e) => e['name']);
      if (!names.includes(name)) {
        pinLog('Pin not found, pins available in registry: ', names.join(', '));
        stop("Pin '", name, "' not found in '", component, "' board.");
      }

      entries[names.findIndex((e) => e == name)];
    }
  );
};

export const pinRegistryRetrievePath = (name, component) => {
  var entry = pinRegistryRetrieve(name, component);

  return entry['path'];
};

export const pinRegistryRetrieveMaybe = (name, component) => {
  return tryCatch(pinRegistryRetrieve(name, component), (error = null));
};

export const pinRegistryRemove = (name, component, unlink = TRUE) => {
  var entries = pinRegistryLoadEntries(component);
  name = pinRegistryQualifyName(name, entries);

  var remove = entries.filter((x) => x['name'] == name);
  if (remove.length > 0) remove = remove[0];
  else return;

  entries = entries.filter((x) => x['name'] != name);

  var removePath = pinRegistryAbsolute(remove$path, component);
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

const pinRegistryLock = (component) => {
  var lockFile = pinRegistryConfig(component) + '.lock';
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

const pinRegistryAbsolute = (path, component) => {
  var basePath = tools__file_path_as_absolute(boardLocalStorage(component));

  if (startsWith(path, basePath)) {
    return path;
  } else {
    return normalizePath(fileSystem.path(basePath, path), (mustWork = false));
  }
};
