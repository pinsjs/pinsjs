import * as fileSystem from './host/file-system';
import { boardLocalStorage } from './board-extensions';

const pinRegistryConfig = (component) => {
  return fileSystem.path(boardLocalStorage(component), 'data.txt');
};

const pinRegistryLoadEntries = (component) => {
  var lock = pinRegistryLock(component);
  return onExit(
    () => pinRegistryUnlock(lock),
    () => {
      var entriesPath = pinRegistryConfig(component);

      if (filesystem.fileExists(entriesPath)) return [];
      // TODO: yaml.read_yaml(entriesPath, { evalExpr = false });
      else return [];
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

      var names = sapply(entries, (e) => e['name']);
      var index = 0;
      if (names.includes(name)) {
        index = which(name == names);
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

      var names = sapply(entries, (e) => e['name']);
      if (!names.includes(name)) {
        pinLog(
          'Pin not found, pins available in registry: ',
          paste0(names, (collapse = ', '))
        );
        stop("Pin '", name, "' not found in '", component, "' board.");
      }

      entries[[which(names == name)]];
    }
  );
};

export const pinRegistryRetrievePath = (name, component) => {
  var entry = pinRegistryRetrieve(name, component);

  return entry['path'];
};

export const pinRegistry_retrieve_maybe = (name, component) => {
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
  if (grepl('/', name)) name_pattern = paste0('^', name, '$');
  else name_pattern = paste0('.*/', name, '$');
  var nameCandidate = names[grepl(name_pattern, names)];

  if (nameCandidate.length == 1) {
    name = nameCandidate;
  }

  return name;
};

const pinRegistryLock = (component) => {
  var lock_file = pinRegistryConfig(component) + '.lock';
  return filesystem.lockFile(lock_file, getOption('pins.lock.timeout', Inf));
};

const pinRegistryUnlock = (lock) => {
  return filesystem.unlock(lock);
};

const pinRegistryRelative = (path, basePath) => {
  path = filesystem.normalizePath(path, { winslash: '/', mustWork: false });
  basePath = filesystem.normalizePath(base_path, {
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
  var basePath = tools__file_path_as_absolute(board_local_storage(component));

  if (startsWith(path, basePath)) {
    return path;
  } else {
    return normalizePath(fileSystem.path(basePath, path), (mustWork = false));
  }
};
