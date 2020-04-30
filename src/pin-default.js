import * as fileSystem from './host/file-system';
import { pinDefaultName } from './utils/pin';
import { boardPinStore } from './pin-extensions';

export const pinDefault = (x, opts = {}) => {
  const { description, board, ...args } = opts;
  const name = opts.name || pinDefaultName(x, board);
  const pinPath = fileSystem.tempfile();

  fileSystem.dir.create(pinPath);

  fileSystem.write(JSON.stringify(x), fileSystem.path(pinPath, 'data.json'));

  boardPinStore(
    board,
    Object.assign(
      {},
      {
        name,
        description,
        path: pinPath,
        type: 'default',
        metadata: [],
      },
      ...args
    )
  );
};

export const pinPreviewDefault = (x) => x;

export const pinLoadDefault = (pinPath) => {
  return JSON.parse(fileSystem.read(pinPath));
};

export const pinFetchDefault = (pinPath) => pinPath;
