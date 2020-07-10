import * as fileSystem from './host/file-system';
import * as arrays from './utils/arrays';
import { boardGet } from './board';
import { pinResetCache } from './pin-registry';
import { pinLog } from './log';
import * as options from './host/options';
import { boardDefault } from './board-default';
import { onExit } from './utils/onexit.js';
import * as checks from './utils/checks';
import {
  pinManifestExists,
  pinManifestGet,
  pinManifestCreate,
} from './pin-manifest';
import { pinsMergeCustomMetadata } from './pins-metadata';
import { boardPinCreate } from './board-extensions';
import { uiViewerUpdated } from './ui-viewer';
import { pinGet } from './pin';

const pinNameFromPath = (pinPath) => {
  const baseName = fileSystem.basename(pinPath);
  const baseNameWithoutExt = fileSystem.tools.filePathSansExt(baseName);

  return baseNameWithoutExt.replace(/[^a-zA-Z0-9]+/g, '_');
};

export const boardPinStore = (board, opts = {}) => {
  var {
    path: path,
    description,
    type,
    metadata,
    extract: extract,
    ...args
  } = opts;

  var customMetadata = args['customMetadata'];
  var zip = args['zip'];

  if (checks.isNull(extract)) extract = true;

  const boardInstance = boardGet(board);
  const name = opts.name || arrays.vectorize(pinNameFromPath)(pinPath);

  pinLog(`Storing ${name} into board ${boardInstance.name} with type ${type}`);

  if (!args.cache) pinResetCache(boardInstance, name);

  path = path.filter((x) => !/data\.txt/g.test(x));

  const storePath = fileSystem.tempfile();
  fileSystem.dir.create(storePath);
  return onExit(
    () => unlink(storePath, { recursive: true }),
    () => {
      if (
        path.length == 1 &&
        /^http/g.test(path) &&
        !/\\.[a-z]{2,4}$/g.test(path) &&
        options.getOption('pins.search.datatxt', true)
      ) {
        // attempt to download data.txt to enable public access to boards like rsconnect
        datatxtPath = fileSystem.path(path, 'data.txt');
        localPath = pinDownload(datatxtPath, name, boardDefault(), {
          canFail: true,
        });
        if (!is.null(local_path)) {
          manifest = pinManifestGet(localPath);
          path = path + '/' + manifest[path];
          extract = false;
        }
      }

      var somethingChanged = false;
      if (zip === true) {
        fileSystem.dir.zip(path[0], fileSystem.path(storePath, 'data.zip'));
        somethingChanged = true;
      } else {
        for (var idxPath = 0; idxPath < path.length; idxPath++) {
          var details = { somethingChanged: true };
          var singlePath = path[idxPath];
          if (/^http/g.test(singlePath)) {
            singlePath = pin_download(
              singlePath,
              name,
              boardDefault(),
              Object.assign(
                {
                  extract: extract,
                  details: details,
                  canFail: true,
                },
                opt
              )
            );

            if (!checks.isNull(details['error'])) {
              var cachedResult = null;
              try {
                pinGet(name, { board: boardDefault() });
              } catch (error) {}
              if (checks.isNull(cachedResult)) {
                throw new exception(details['error']);
              } else {
                pinLog(details['error']);
              }
              return cachedResult;
            }
          }

          if (details['somethingChanged']) {
            if (fileSystem.dir.exists(singlePath)) {
              fileSystem.copy(dir(singlePath, { fullNames: true }), storePath, {
                recursive: true,
              });
            } else {
              fileSystem.copy(singlePath, storePath, { recursive: true });
            }

            somethingChanged = true;
          }
        }
      }

      if (somethingChanged) {
        if (!pinManifestExists(storePath)) {
          metadata['description'] = description;
          metadata['type'] = type;

          metadata = pinsMergeCustomMetadata(metadata, customMetadata);

          pinManifestCreate(
            storePath,
            metadata,
            fileSystem.dir.list(storePath, { recursive: true })
          );
        }

        boardPinCreate(boardInstance, storePath, name, metadata, ...args);

        uiViewerUpdated(boardInstance);
      }

      return pinGet(
        name,
        Object.assign({ board: boardInstance['name'] }, ...args)
      );
    }
  );
};
