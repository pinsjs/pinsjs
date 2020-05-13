import * as fileSystem from './host/file-system';
import * as versions from './versions';
import { pinStoragePath } from './pin-registry';

export const boardInitializeLocal = (board, cache, ...args) => {
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
  versions.boardVersionsCreate(board, (name = name), (path = path));

  var finalPath = pinStoragePath(board, name);

  var toDelete = fileSystem.dir.list(final_path, { fullNames: true });
  toDelete = toDelete.filter((e) => /(\/|\\)_versions$/gi.test(e));
  fileSystem.dir.remove(toDelete, { recursive: true });
  if (!fileSystem.dir.exists(finalPath)) fileSystem.dir.create(finalPath);

  fileSystem.copy(fileSystem.dir.list(path, { fullNames: true }), finalPath, {
    recursive: true,
  });

  // reduce index size
  metadata['columns'] = null;

  var basePath = boardLocalStorage(board);

  return pinRegistryUpdate(
    name,
    board,
    Object.assign(
      {
        path: pinRegistryRelative(finalPath, { basePath: basePath }),
      },
      metadata
    )
  );
};

export const boardPinFindLocal = (board, text, ...args) => {
  var results = pinRegistryFind(text, board);

  if (results.length == 1) {
    var metadata = JSON.parse(results['metadata']);
    var path = pinRegistryAbsolute(metadata['path'], board);
    var extended = pinManifestGet(path);
    var merged = pinManifestMerge(metadata, extended);

    results['metadata'] = JSON.stringify(merged);
  }

  return results;
};

export const boardPinGetLocal = (board, name, version, ...args) => {
  var path = pinRegistryRetrievePath(name, board);

  if (!checks.isNull(version)) {
    var manifest = pinManifestGet(pinRegistryAbsolute(path, board));

    if (!manifest['versions'].includes(version)) {
      version = boardVersionsExpand(manifest['versions'], version);
    }

    path = fileSystem.path(name, version);
  }

  return pinRegistryAbsolute(path, board);
};

export const boardPinRemoveLocal = (board, name) => {
  return pinRegistryRemove(name, board);
};

export const boardPinVersionsLocal = (board, name, ...args) => {
  return boardVersionsGet(board, name);
};
