export * from './board';
export * from './pin';

import callbacks from './host/callbacks';
export { callbacks };

import * as pinDefault from './pin-default';
import * as inheritance from './utils/inheritance';

import * as boardExtensions from './board-extensions';
import * as boardLocal from './board-local';
import * as boardDatatxt from './board-datatxt';

import { pinString } from './pin-file';
import { pinLoadFiles } from './pin-files';
import { pinDataFrame } from './pin-dataframe';

inheritance.registerMethod('pin', 'default', pinDefault.pinDefault);
inheritance.registerMethod('pin', 'string', pinString);
inheritance.registerMethod('pin', 'dataframe', pinDataFrame);

inheritance.registerMethod('pinPreview', 'default', pinDefault.pinPreviewDefault);
inheritance.registerMethod('pinLoad', 'default', pinDefault.pinLoadDefault);
inheritance.registerMethod('pinFetch', 'default', pinDefault.pinFetchDefault);

inheritance.registerMethod('pinLoad', 'files', pinLoadFiles);

inheritance.registerMethod('boardBrowse', 'default', boardExtensions.boardBrowseDefault);
inheritance.registerMethod('boardPinVersions', 'default', boardExtensions.boardPinVersionsDefault);
inheritance.registerMethod('boardInitialize', 'default', boardExtensions.boardInitializeDefault);

inheritance.registerMethod('boardInitialize', 'local', boardLocal.boardInitializeLocal);
inheritance.registerMethod('boardPinCreate', 'local', boardLocal.boardPinCreateLocal);
inheritance.registerMethod('boardPinFind', 'local', boardLocal.boardPinFindLocal);
inheritance.registerMethod('boardPinGet', 'local', boardLocal.boardPinGetLocal);
inheritance.registerMethod('boardPinRemove', 'local', boardLocal.boardPinRemoveLocal);
inheritance.registerMethod('boardPinVersions', 'local', boardLocal.boardPinVersionsLocal);

inheritance.registerMethod('boardInitialize', 'datatxt', boardDatatxt.boardInitializeDatatxt);
