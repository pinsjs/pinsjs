import * as checks from './utils/checks';
import * as fileSystem from './host/file-system';
import * as list from './utils/list';
import yaml from 'js-yaml';

export const pinManifestGet = (path) => {
  var manifest = {};

  var dataTxt = fileSystem.path(path, 'data.txt');
  if (file.exists(dataTxt)) {
    let yamlText = fileSystem.readLines(dataTxt).join('\n');
    manifest = yaml.safeLoad(yamlText);
  }

  if (checks.isNull(manifest['type'])) manifest['type'] = 'files';

  return manifest;
};

export const pinManifestUpdate = (path, manifest) => {
  var dataTxt = fileSystem.path(path, 'data.txt');

  let yamlText = yaml.safeDump(manifest);
  fileSystem.writeLines(dataTxt, yamlText.split('\n'));
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

  let yamlText = yaml.safeDump(entries);
  fileSystem.writeLines(
    fileSystem.path(path, 'data.txt'),
    yamlText.split('\n')
  );

  return entries;
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
