export * from './board';
export * from './pin';

import callbacks from './host/callbacks';
export { callbacks };

import * as pinDefault from './pin-default';
import * as inheritance from './utils/inheritance';

import * as boardExtensions from './board-extensions';
import * as boardLocal from './board-local';
import * as boardDatatxt from './board-datatxt';
import * as boardS3 from './board-s3';
import * as boardAzure from './board-azure';
import * as boardGCloud from './board-gcloud';
import * as boardDospaces from './board-dospaces';

export * from './board-s3';
export * from './board-azure';
export * from './board-gcloud';
export * from './board-dospaces';

import { pinString } from './pin-file';
import { pinLoadFiles } from './pin-files';
import { pinDataFrame, pinLoadTable } from './pin-dataframe';

inheritance.registerMethod('pin', 'default', pinDefault.pinDefault);
inheritance.registerMethod('pin', 'string', pinString);
inheritance.registerMethod('pin', 'dataframe', pinDataFrame);

inheritance.registerMethod('pinPreview', 'default', pinDefault.pinPreviewDefault);
inheritance.registerMethod('pinLoad', 'default', pinDefault.pinLoadDefault);
inheritance.registerMethod('pinFetch', 'default', pinDefault.pinFetchDefault);

inheritance.registerMethod('pinLoad', 'files', pinLoadFiles);
inheritance.registerMethod('pinLoad', 'table', pinLoadTable);

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
inheritance.registerMethod('boardPinCreate', 'datatxt', boardDatatxt.boardPinCreateDatatxt);
inheritance.registerMethod('boardPinFind', 'datatxt', boardDatatxt.boardPinFindDatatxt);
inheritance.registerMethod('boardPinGet', 'datatxt', boardDatatxt.boardPinGetDatatxt);
inheritance.registerMethod('boardPinRemove', 'datatxt', boardDatatxt.boardPinRemoveDatatxt);
inheritance.registerMethod('boardPinVersions', 'datatxt', boardDatatxt.boardPinVersionsDatatxt);

inheritance.registerMethod('boardInitialize', 's3', boardS3.boardInitializeS3);
inheritance.registerMethod('boardPinCreate', 's3', boardDatatxt.boardPinCreateDatatxt);
inheritance.registerMethod('boardPinFind', 's3', boardDatatxt.boardPinFindDatatxt);
inheritance.registerMethod('boardPinGet', 's3', boardDatatxt.boardPinGetDatatxt);
inheritance.registerMethod('boardPinRemove', 's3', boardDatatxt.boardPinRemoveDatatxt);
inheritance.registerMethod('boardPinVersions', 's3', boardDatatxt.boardPinVersionsDatatxt);

inheritance.registerMethod('boardInitialize', 'azure', boardAzure.boardInitializeAzure);
inheritance.registerMethod('boardInitialize', 'gcloud', boardGCloud.boardInitializeGCloud);
inheritance.registerMethod('boardInitialize', 'dospaces', boardDospaces.boardInitializeDospaces);

