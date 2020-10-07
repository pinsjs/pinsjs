import yaml from 'js-yaml';
import * as fileSystem from './host/file-system';

export const boardManifestGet = (path, defaultEmpty = false) => {
  if (!fileSystem.fileExists(path) && defaultEmpty) {
    return [];
  }

  const yamlText = fileSystem.readLines(path).join('\n');
  const result = yaml.safeLoad(yamlText);

  return result.map ? result : [result];
};

export const boardManifestCreate = (index, file) => {
  // yaml::write_yaml(index, file)
};

export const boardManifestLoad = (manifest) => {
  const result = yaml.safeLoad(manifest);

  return result.map ? result : [result];
};
