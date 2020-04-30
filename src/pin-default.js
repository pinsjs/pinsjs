import host from './host';
import { pinDefaultName } from './utils';
import { boardPinStore } from './pin-extensions';

const pinDefault = (x, opts = {}) => {
  const { description, board, ...args } = opts;
  const name = opts.name || pinDefaultName(x, board);
  const pinPath = system.tempfile();

  system.dir.create(pinPath);

  host.file.write(JSON.stringify(object), host.file.path(pinPath, 'data.json'));

  boardPinStore(board, {
    name,
    description,
    path: pinPath,
    type: 'default',
    metadata: [],
    ...args,
  });
};

const pinPreviewDefault = (x) => x;

const pinLoadDefault = (pinPath) => {
  return JSON.parse(host.file.read(pinPath));
};

const pinFetchDefault = (pinPath) => pinPath;

system.registerMethod('pin', 'default', pinDefault);
system.registerMethod('pinPreview', 'default', pinPreviewDefault);
system.registerMethod('pinLoad', 'default', pinLoadDefault);
system.registerMethod('pinFetch', 'default', pinFetchDefault);
