import path from 'path';
import system from './system';
import { pinDefaultName } from './utils';
import { boardPinStore } from './pin-extensions';

const pinDefault = (x, opts = {}) => {
  const { description, board, ...args } = opts;
  const name = opts.name || pinDefaultName(x, board);
  const pinPath = system.tempfile();

  system.dir.create(pinPath);
  system.saveRds(x, { file: path.resolve(pinPath, 'data.rds'), version: 2 });

  boardPinStore(board, pinPath, name, description, 'default', [], ...args);
};

const pinPreviewDefault = (x) => x;

// TODO: handle AsIs?
const pinLoadDefault = (pinPath) => {
  return system.readRds(path.resolve(pinPath, 'data.rds'));
};

const pinFetchDefault = (pinPath) => pinPath;

system.registerMethod('pin', 'default', pinDefault);
system.registerMethod('pinPreview', 'default', pinPreviewDefault);
system.registerMethod('pinLoad', 'default', pinLoadDefault);
system.registerMethod('pinFetch', 'default', pinFetchDefault);
