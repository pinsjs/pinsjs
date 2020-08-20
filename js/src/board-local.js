import * as fileSystem from './host/file-system';
import * as versions from './versions';
import * as registry from './pin-registry';
import { boardLocalStorage } from './board-storage';
import * as checks from './utils/checks';
import { pinManifestGet, pinManifestMerge } from './pin-manifest';

export const boardInitializeLocal = (board, ...args) => {
  var cache = args['cache'];
  if (!fileSystem.dir.exists(board['cache']))
    fileSystem.dir.create(board['cache'], { recursive: true });

  return board;
};

export const guessExtensionFromPath = (path) => {
  if (fileSystem.dir.exists(path)) {
    var allFiles = fileSystem.dir.list(path, { recursive: true });
    allFiles = allFiles.filter((x) => !/data\\.txt/gi.test(x));

    path = allFiles[0];
  }

  fileSystem.tools.fileExt(path);
};

export const boardPinCreateLocal = (board, path, name, metadata, ...args) => {
  versions.boardVersionsCreate(board, name, path);

  var finalPath = registry.pinStoragePath(board, name);

  var toDelete = fileSystem.dir.list(finalPath, { fullNames: true });
  toDelete = toDelete.filter((e) => /(\/|\\)_versions$/gi.test(e));
  fileSystem.dir.remove(toDelete, { recursive: true });
  if (!fileSystem.dir.exists(finalPath)) fileSystem.dir.create(finalPath);

  fileSystem.copy(fileSystem.dir.list(path, { fullNames: true }), finalPath, {
    recursive: true,
  });

  // reduce index size
  metadata['columns'] = null;

  var basePath = boardLocalStorage(board);

  return registry.pinRegistryUpdate(
    name,
    board,
    Object.assign(
      {
        path: registry.pinRegistryRelative(finalPath, { basePath: basePath }),
      },
      metadata
    )
  );
};

export const boardPinFindLocal = (board, text, ...args) => {
  var results = registry.pinRegistryFind(text, board);

  if (results.length == 1) {
    var metadata = results[0]['metadata'];
    var path = registry.pinRegistryAbsolute(metadata['path'], board);
    var extended = pinManifestGet(path);
    var merged = pinManifestMerge(metadata, extended);

    results[0]['metadata'] = merged;
  }

  return results;
};

export const boardPinGetLocal = (board, name, ...args) => {
  var version = args['version'];
  var path = registry.pinRegistryRetrievePath(name, board);

  if (!checks.isNull(version)) {
    var manifest = pinManifestGet(registry.pinRegistryAbsolute(path, board));

    if (!manifest['versions'].includes(version)) {
      version = boardVersionsExpand(manifest['versions'], version);
    }

    path = fileSystem.path(name, version);
  }

  return registry.pinRegistryAbsolute(path, board);
};

export const boardPinRemoveLocal = (board, name, ...args) => {
  return registry.pinRegistryRemove(name, board);
};

export const boardPinVersionsLocal = (board, name, ...args) => {
  return versions.boardVersionsGet(board, name);
};
