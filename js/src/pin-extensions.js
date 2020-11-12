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
import { pinDownload } from './pin-download';
import { boardPinCreate } from './board-extensions';
import { uiViewerUpdated } from './ui-viewer';
import { pinGet } from './pin';

function pinNameFromPath(pinPath) {
  const baseName = fileSystem.basename(pinPath);
  const baseNameWithoutExt = fileSystem.tools.filePathSansExt(baseName);

  return baseNameWithoutExt.replace(/[^a-zA-Z0-9]+/g, '_');
}

export async function boardPinStore(board, opts) {
  var {
    path,
    description,
    type,
    metadata,
    extract,
    retrieve,
    ...args
  } = Object.assign({ retrieve: true }, opts);
  path = arrays.ensure(path);

  var customMetadata = args['customMetadata'];
  var zip = args['zip'];

  if (checks.isNull(extract)) extract = true;

  const boardInstance = boardGet(board);
  const name = opts.name || arrays.vectorize(pinNameFromPath)(pinPath);

  pinLog(`Storing ${name} into board ${boardInstance.name} with type ${type}`);

  if (!args.cache) await pinResetCache(boardInstance, name);
  path = path.filter((x) => !/data\.txt/g.test(x));

  const storePath = fileSystem.tempfile();

  fileSystem.dir.create(storePath);

  return await onExit(
    () => fileSystem.dir.remove(storePath, { recursive: true }),
    async () => {
      if (
        path.length == 1 &&
        /^http/g.test(path) &&
        !/\\.[a-z]{2,4}$/g.test(path) &&
        options.getOption('pins.search.datatxt', true)
      ) {
        // attempt to download data.txt to enable public access to boards like rsconnect
        const datatxtPath = fileSystem.path(path, 'data.txt');
        const localPath = pinDownload(datatxtPath, name, boardDefault(), {
          canFail: true,
        });

        if (localPath) {
          var manifest = null;
          try {
            manifest = pinManifestGet(localPath);
          } catch (error) {
            fileSystem.fileRemove(fileSystem.path(localPath, 'data.txt'));
          }
          if (!checks.isNull(manifest) && !checks.isNull(manifest[path])) {
            path = `${path}/${manifest[path]}`;
            extract = false;
          }
        }
      }

      let somethingChanged = false;

      if (zip) {
        var findCommonPath = function (path) {
          var common = path[0];
          if (
            arrays.all(path, (common) => startsWith(common)) ||
            common === fileSystem.dirname(common)
          )
            return common;
          return findCommonPath(fileSystem.dirname(common[0]));
        };

        var commonPath = findCommonPath(path);
        fileSystem.dir.zip(
          commonPath.map((e) => e.replace(common_path + '/', '')),
          fileSystem.path(storePath, 'data.zip'),
          commonPath
        );
        somethingChanged = true;
      } else {
        path.forEach((singlePath, idxPath) => {
          const details = { somethingChanged: true };

          if (/^http/g.test(singlePath)) {
            singlePath = pinDownload(
              singlePath,
              name,
              boardDefault(),
              Object.assign({ extract, details, canFail: true }, opt)
            );

            if (!checks.isNull(details['error'])) {
              var cachedResult = null;
              try {
                pinGet(name, { board: boardDefault() });
              } catch (error) {}
              if (checks.isNull(cachedResult)) {
                throw new Error(details['error']);
              } else {
                pinLog(details['error']);
              }
              return cachedResult;
            }
          }

          if (details.somethingChanged) {
            const copyOrLink = (from, to) => {
              if (
                fileSystem.fileExists(from) &&
                fileSystem.fileSize(from) >=
                  options.getOption('pins.link.size', Math.pow(10, 8)) &&
                fileSystem.supportsLinks()
              )
                fileSystem.createLink(
                  from,
                  fileSystem.path(to, fileSystem.basename(from))
                );
              else fileSystem.copy(from, to, { recursive: true });
            };

            if (fileSystem.dir.exists(singlePath)) {
              fileSystem.dir
                .list(singlePath, { fullNames: true })
                .forEach((entry) => copyOrLink(entry, storePath));
            } else {
              copyOrLink(singlePath, storePath);
            }

            somethingChanged = true;
          }
        });
      }

      if (somethingChanged) {
        if (!pinManifestExists(storePath)) {
          metadata.description = description;
          metadata.type = type;

          metadata = pinsMergeCustomMetadata(metadata, customMetadata);

          pinManifestCreate(
            storePath,
            metadata,
            fileSystem.dir.list(storePath, { recursive: true })
          );
        }

        await boardPinCreate(boardInstance, storePath, name, metadata, ...args);

        uiViewerUpdated(boardInstance);
      }

      if (retrieve) {
        return await pinGet(
          name,
          Object.assign({ board: boardInstance['name'] }, ...args)
        );
      } else {
        return null;
      }
    }
  );
}
