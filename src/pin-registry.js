import * as fileSystem from './host/file-system';
import { boardLocalStorage } from './board-extensions';

const pinRegistryConfig = (component) => {
  fileSystem.path(boardLocalStorage(component), 'data.txt');
};

const pinRegistryLoadEntries = (component) => {
  lock = pinRegistryLock(component);
  return onExit(
    () => pinRegistryUnlock(lock),
    () => {
      entriesPath = pinRegistryConfig(component);

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
  path = fileSystem.path(boardLocalStorage(component), name);
  if (!dir.exists(path)) dir.create(path, (recursive = true));

  return path;
};

export const pinRegistryUpdate = (name, component, params = list()) => {
  var lock = pinRegistryLock(component);
  return onExit(
    () => pinRegistryUnlock(lock),
    () => {
      entries = pinRegistryLoadEntries(component);
      name = pinRegistryQualifyName(name, entries);

      path = pinStoragePath(component, name);

      if (entries === null) entries = {};

      names = sapply(entries, (e) => e['name']);
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
      entries = pinRegistryLoadEntries(component);

      results = pinResultsFromRows(entries);

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
  lock = pinRegistryLock(component);
  onExit(
    () => pinRegistryUnlock(lock),
    () => {
      entries = pinRegistryLoadEntries(component);
      name = pinRegistryQualifyName(name, entries);

      names = sapply(entries, (e) => e['name']);
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
  entry = pinRegistryRetrieve(name, component);

  return entry['path'];
};

export const pinRegistry_retrieve_maybe = (name, component) => {
  return tryCatch(pinRegistryRetrieve(name, component), (error = null));
};

export const pinRegistryRemove = (name, component, unlink = TRUE) => {
  entries = pinRegistryLoadEntries(component);
  name = pinRegistryQualifyName(name, entries);

  remove = entries.filter((x) => x['name'] == name);
  if (remove.length > 0) remove = remove[0];
  else return;

  entries = entries.filter((x) => x['name'] != name);

  remove_path = pinRegistryAbsolute(remove$path, component);
  if (unlink) unlink(remove_path, (recursive = TRUE));

  return pinRegistrySaveEntries(entries, component);
};

const pinRegistryQualifyName = (name, entries) => {
  names = entries.map((e) => e['name']);
  if (grepl('/', name)) name_pattern = paste0('^', name, '$');
  else name_pattern = paste0('.*/', name, '$');
  name_candidate = names[grepl(name_pattern, names)];

  if (name_candidate.length == 1) {
    name = name_candidate;
  }

  return name;
};

const pinRegistryLock = (component) => {
  lock_file = pinRegistryConfig(component) + '.lock';
  filesystem.lockFile(lock_file, getOption('pins.lock.timeout', Inf));
};

const pinRegistryUnlock = (lock) => {
  filesystem.unlock(lock);
};

const pinRegistryRelative = (path, base_path) => {
  path = filesystem.normalizePath(path, { winslash: '/', mustWork: false });
  base_path = filesystem.normalizePath(base_path, {
    winslash: '/',
    mustWork: false,
  });

  if (startsWith(path, base_path)) {
    path = substr(path, nchar(base_path) + 1, nchar(path));
  }

  relative = gsub('^/', '', path);

  return relative;
};

const pinRegistryAbsolute = (path, component) => {
  base_path = tools__file_path_as_absolute(board_local_storage(component));

  if (startsWith(path, base_path)) {
    return path;
  } else {
    return normalizePath(fileSystem.path(base_path, path), (mustWork = false));
  }
};
