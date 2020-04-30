export * from './board';
export * from './pin';

import callbacks from './host/callbacks';
export { callbacks };

import * as pinDefault from './pin-default';
import * as inheritance from './utils/inheritance';

inheritance.registerMethod('pin', 'default', pinDefault.pinDefault);
inheritance.registerMethod(
  'pinPreview',
  'default',
  pinDefault.pinPreviewDefault
);
inheritance.registerMethod('pinLoad', 'default', pinDefault.pinLoadDefault);
inheritance.registerMethod('pinFetch', 'default', pinDefault.pinFetchDefault);
