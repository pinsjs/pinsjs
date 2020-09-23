import yaml from 'js-yaml';
import * as fileSystem from './host/file-system';

export const boardManifestGet = (path, defaultEmpty = false) => {
  if (!fileSystem.fileExists(path) && defaultEmpty) {
    return [];
  }

  let yamlText = fileSystem.readLines(path).join('\n');

  return yaml.safeLoad(yamlText);
};

export const boardManifestCreate = (index, file) => {
  // yaml::write_yaml(index, file)
};

export const boardManifestLoad = (manifest) => {
  return yaml.safeLoad(manifest);
};
