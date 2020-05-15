import * as checks from './utils/checks';
import * as fileSystem from './host/file-system';
import * as list from './utils/list';

export const pinManifestGet = (path) => {
  var manifest = {};

  var dataTxt = fileSystem.path(path, 'data.txt');
  if (file.exists(dataTxt)) {
    manifest = {}; // TODO yaml__read_yaml(dataTxt, evalExpr = false);
  }

  if (checks.isNull(manifest['type'])) manifest['type'] = 'files';

  return manifest;
};

export const pinManifestUpdate = (path, manifest) => {
  var dataTxt = fileSystem.path(path, 'data.txt');

  var manifest = ''; // TODO yaml__write_yaml(manifest, dataTxt);

  return manifest;
};

export const pinManifestExists = (path) => {
  return fileSystem.fileExists(fileSystem.path(path, 'data.txt'));
};

export const pinManifestCreate = (path, metadata, files) => {
  var entries = Object.assign(
    {
      path: files,
    },
    metadata
  );

  list.removeNulls(entries);

  return {}; // TODO yaml__write_yaml(entries, fileSystem.path(path, "data.txt"));
};

// retrieve a list of files to download
export const pinManifestDownload = (path) => {
  var manifest = pinManifestGet(path);

  if (checks.isNull(manifest['path'])) return null;
  return pinFetch({
    path: manifest['path'],
    class: manifest['type'],
  });
};

export const pinManifestMerge = (baseManifest, resourceManifest) => {
  // path requires special merge
  if (
    !checks.isNull(resourceManifest['path']) &&
    !checks.isNull(baseManifest['path']) &&
    !/https?:\/\//g.test(baseManifest['path'])
  ) {
    baseManifest['path'] = fileSystem.path(
      baseManifest['path'],
      resourceManifest['path']
    );
  }

  baseManifest = Object.assign(baseManifest, resourceManifest);

  return baseManifest;
};
