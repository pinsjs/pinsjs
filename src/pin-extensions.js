import system from './system';
import { boardGet } from './board';
import { pinResetCache } from './pin-tools';
import { pinLog } from './log';

const pinNameFromPath = (pinPath) => {
  const baseName = system.basename(pinPath);
  const baseNameWithoutExt = system.tools.filePathSansExt(baseName);

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
  const name = opts.name || pinNameFromPath(pinPath);
  const boardInstance = boardGet(board);

  pinLog(`Storing ${name} into board ${boardInstance.name} with type ${type}`);

  if (!args.cache) pinResetCache(boardInstance.name, name);

  // TODO: is path a vector here?
  // path <- path[!grepl("data\\.txt", path)]

  const storePath = system.tempfile();
  system.dir.create(storePath);

  // TODO: not sure about path here...
  throw 'NYI';
};
