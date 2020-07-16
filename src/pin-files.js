import * as fileSystem from './host/file-system';
import * as arrays from './utils/arrays';
import { boardPinStore } from './pin-extensions';

export const pinLoadFiles = (
  x,
  opts = { name: null, description: null, board: null }
) => {
  const { name, description, board, ...args } = opts;
  var paths = arrays.ensure(x);
  var extension = paths.length > 0 ? 'zip' : fileSystem.tools.fileExt(paths);
  return boardPinStore(
    board,
    Object.assign(
      {},
      {
        name,
        description,
        path: paths,
        type: 'files',
        metadata: {
          extension: extension,
        },
      },
      ...args
    )
  );
};
