import * as checks from './utils/checks';
import * as fileSystem from './host/file-system';
import * as list from './utils/list';
import { pinFetch } from './pin';
import yaml from 'js-yaml';

export function pinManifestGet(path) {
  var manifest = {};

  var dataTxt = fileSystem.path(path, 'data.txt');
  if (fileSystem.fileExists(dataTxt)) {
    let yamlText = fileSystem.readLines(dataTxt).join('\n');

    manifest = yaml.safeLoad(yamlText);
  }

  if (checks.isNull(manifest['type'])) manifest['type'] = 'files';

  return manifest;
}

export function pinManifestUpdate(path, manifest) {
  var dataTxt = fileSystem.path(path, 'data.txt');

  let yamlText = yaml.safeDump(manifest);
  fileSystem.writeLines(dataTxt, yamlText.split('\n'));
}

export function pinManifestExists(path) {
  return fileSystem.fileExists(fileSystem.path(path, 'data.txt'));
}

export function pinManifestCreate(path, metadata, files) {
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
}

// retrieve a list of files to download
export function pinManifestDownload(path) {
  var manifest = pinManifestGet(path);

  if (checks.isNull(manifest['path'])) return null;
  return pinFetch({
    path: manifest['path'],
    class: manifest['type'],
  });
}

export function pinManifestMerge(baseManifest, resourceManifest) {
  // path requires special merge
  if (
    !checks.isNull(resourceManifest['path']) &&
    !checks.isNull(baseManifest['path']) &&
    !/https?:\/\//g.test(baseManifest['path'])
  ) {
    baseManifest['path'] = fileSystem.path(
      baseManifest['path'],
      resourceManifest['path'][0]
    );
  }

  baseManifest = Object.assign(baseManifest, resourceManifest);

  return baseManifest;
}
