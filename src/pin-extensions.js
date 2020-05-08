import * as fileSystem from './host/file-system';
import * as arrays from './utils/arrays';
import { boardGet } from './board';
import { pinResetCache } from './pin-tools';
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

const pinNameFromPath = (pinPath) => {
  const baseName = fileSystem.basename(pinPath);
  const baseNameWithoutExt = fileSystem.tools.filePathSansExt(baseName);

  return baseNameWithoutExt.replace(/[^a-zA-Z0-9]+/gi, '_');
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

  if (checks.isNull(extract)) extract = true;

  const boardInstance = boardGet(board);
  const name = opts.name || arrays.vectorize(pinNameFromPath)(pinPath);

  pinLog(`Storing ${name} into board ${boardInstance.name} with type ${type}`);

  if (!args.cache) pinResetCache(boardInstance.name, name);

  path = path.filter((x) => !/data\.txt/gi.test(x));

  const storePath = fileSystem.tempfile();
  fileSystem.dir.create(storePath);
  return onExit(
    () => unlink(storePath, { recursive: true }),
    () => {
      if (
        path.length == 1 &&
        /^http/gi.test(path) &&
        !/\\.[a-z]{2,4}$/gi.test(path) &&
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

      for (var idxPath = 0; idxPath < path.length; idxPath++) {
        var singlePath = path[idxPath];
        if (/^http/gi.test(singlePath)) {
          singlePath = pin_download(
            singlePath,
            name,
            boardDefault(),
            Object.assign(
              {
                extract: extract,
              },
              opt
            )
          );
        }

        if (fileSystem.dir.exists(singlePath)) {
          fileSystem.copy(dir(singlePath, { fullNames: true }), storePath, {
            recursive: true,
          });
        } else {
          fileSystem.copy(singlePath, storePath, { recursive: true });
        }
      }

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

      boardPinCreate(board, storePath, name, metadata, ...args);

      uiViewerUpdated(board);

      pinGet(name, board$name, ...args);
    }
  );
};
