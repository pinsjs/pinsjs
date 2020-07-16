import * as fileSystem from './host/file-system';
import { pinDefaultName } from './utils/pin-utils';
import { boardPinStore } from './pin-extensions';

export const pinDefault = (x, opts = {}) => {
  const { description, board, ...args } = opts;
  const name = opts.name || pinDefaultName(x, board);
  const pinPath = fileSystem.tempfile();

  fileSystem.dir.create(pinPath);

  fileSystem.write(JSON.stringify(x), fileSystem.path(pinPath, 'data.json'));

  return boardPinStore(
    board,
    Object.assign(
      {},
      {
        name,
        description,
        path: [pinPath],
        type: 'default',
        metadata: [],
      },
      ...args
    )
  );
};

export const pinPreviewDefault = (x, ...args) => x;

export const pinLoadDefault = (path, ...args) => {
  return JSON.parse(fileSystem.read(fileSystem.path(path, 'data.json')));
};

export const pinFetchDefault = (...args) => args['path'];
