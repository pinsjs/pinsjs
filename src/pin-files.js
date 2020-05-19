import * as fileSystem from './host/file-system';

export const pinLoadFiles = (path, ...args) => {
  var files = fileSystem.dir.list(path, { recursive: true, fullNames: true });

  var result = files.filter((e) => !new RegExp('data\\.txt$').test(e));

  return result;
};
