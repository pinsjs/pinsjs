import * as fileSystem from './host/file-system';
import * as arrays from './utils/arrays';
import { boardPinStore } from './pin-extensions';

export const pinString = async (
  x,
  opts = { name: null, description: null, board: null }
) => {
  const { name, description, board, ...args } = opts;
  const paths = arrays.ensure(x);
  const extension = paths.length > 0 ? 'zip' : fileSystem.tools.fileExt(paths);

  return await boardPinStore(
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

export const pinFileCacheMaxAge = (cacheControl) => {
  if (!cacheControl) return null;

  let maxAge = new RegExp('max-age').test(cacheControl);

  if (maxAge.length !== 1) return null;
  maxAge = cacheControl.replace(/.*max-age=/, '');

  return parseFloat(maxAge.replace(/,.*$/, ''));
};
