import * as fileSystem from './host/file-system';
import { boardGet } from './board';
import { pinResetCache } from './pin-tools';
import { pinLog } from './log';

const pinNameFromPath = (pinPath) => {
  const baseName = fileSystem.basename(pinPath);
  const baseNameWithoutExt = fileSystem.tools.filePathSansExt(baseName);

  return baseNameWithoutExt.replace(/[^a-zA-Z0-9]+/gi, '_');
};

export const boardPinStore = (board, opts = {}) => {
  const {
    path: pinPath,
    description,
    type,
    metadata,
    extract = true,
    ...args
  } = opts;

  const boardInstance = boardGet(board);
  const name = opts.name || arrays.vectorize(pinNameFromPath)(pinPath);

  pinLog(`Storing ${name} into board ${boardInstance.name} with type ${type}`);

  if (!args.cache) pinResetCache(boardInstance.name, name);

  path = path.filter((x) => !/data\.txt/gi.test(x));

  const storePath = fileSystem.tempfile();
  fileSystem.dir.create(storePath);
  // on.exit(unlink(store_path, recursive = TRUE))

  // TODO: not sure about path here...
  throw 'NYI';
};
