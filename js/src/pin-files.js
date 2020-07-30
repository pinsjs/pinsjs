import * as fileSystem from './host/file-system';

export const pinLoadFiles = function (path, { ...args }) {
  var files = fileSystem.dir.list(path, { recursive: true, fullNames: true });

  var result = files.filter((e) => !/data\.txt$/g.test(e));

  return result;
};

export const pinPreviewFiles = function (x, { board = null, ...args }) {
  dataFrame(x, { files: 'character' });
};
