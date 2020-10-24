import yaml from 'js-yaml';
import * as fileSystem from './host/file-system';

export function boardManifestGet(path, defaultEmpty = false) {
  if (!fileSystem.fileExists(path) && defaultEmpty) {
    return [];
  }

  const yamlText = fileSystem.readLines(path).join('\n');
  const result = yaml.safeLoad(yamlText);

  return !!result.map ? result : [result];
}

export function boardManifestCreate(index, file) {
  const yamlText = yaml.safeDump(index);

  fileSystem.writeLines(file, yamlText.split('\n'));
}

export function boardManifestLoad(manifest) {
  const result = yaml.safeLoad(manifest);

  return !!result.map ? result : [result];
}
