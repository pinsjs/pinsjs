export * from './board';
export * from './pin';

import callbacks from './host/callbacks';
export { callbacks };

import * as pinDefault from './pin-default';
import * as inheritance from './utils/inheritance';

import * as boardExtensions from './board-extensions';
import * as boardLocal from './board-local';

inheritance.registerMethod('pin', 'default', pinDefault.pinDefault);
inheritance.registerMethod(
  'pinPreview',
  'default',
  pinDefault.pinPreviewDefault
);
inheritance.registerMethod('pinLoad', 'default', pinDefault.pinLoadDefault);
inheritance.registerMethod('pinFetch', 'default', pinDefault.pinFetchDefault);

inheritance.registerMethod(
  'boardBrowse',
  'default',
  boardExtensions.boardBrowse
);
inheritance.registerMethod(
  'boardPinVersions',
  'default',
  boardExtensions.boardPinVersions
);
inheritance.registerMethod(
  'boardInitialize',
  'default',
  boardExtensions.boardInitializeDefault
);

inheritance.registerMethod(
  'boardInitialize',
  'local',
  boardLocal.boardInitializeLocal
);
