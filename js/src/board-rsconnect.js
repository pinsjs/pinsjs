import * as fileSystem from './host/file-system';
import callbacks from './host/callbacks';
import { getFunction } from './host/getFunction';
import { pinLog } from './log';
import { boardVersionsEnabled } from './versions';
import {
  rsconnectApiAuth,
  rsconnectApiVersion,
  rsconnectApiGet,
} from './board-rsconnect-api';
import { rsconnectTokenInitialize } from './board-rsconnect-token';

const rsconnectDependencies = () => ({
  outputMetadata: getFunction('output_metadata', 'rmarkdown'),
});

const rsconnectPinsSupported = async (board) => {
  const version = await rsconnectApiVersion(board);

  return version > '1.7.7';
};

export const boardInitializeRSConnect = async (board, args) => {
  const env = callbacks.get('env');
  const envvarKey = env('CONNECT_API_KEY') || env('RSCONNECT_API');

  if (!args.key && envvarKey) {
    args.key = envvarKey;
  }

  const envvarServer = env('CONNECT_SERVER') || env('RSCONNECT_SERVER');

  if (!args.server && envvarServer) {
    args.server = envvarServer;
  }

  if (args.server) {
    board.server = args.server.replace('/$', '');
    board.serverName = args.server.replace('https?://|(:[0-9]+)?/.*', '');
  }

  board.account = args.account;
  board.outputFiles = args.outputFiles;

  if (!args.key) {
    throw new Error('Invalid API key, the API key is empty.');
  }

  board.key = args.key;

  if (board.key && !board.server) {
    throw new Error(
      `Please specify the 'server' parameter when using API keys.`
    );
  }

  if (!rsconnectApiAuth(board) && !board.outputFiles) {
    board = rsconnectTokenInitialize(board);
  }

  try {
    board.pinsSupported = await rsconnectPinsSupported(board);
  } catch (e) {
    board.pinsSupported = false;
  }

  if (!board.account) {
    const { username } = await rsconnectApiGet(
      board,
      '/__api__/users/current/'
    );

    board.account = username;
  }

  return board;
};

export const boardPinCreateRSConnect = (board, args) => {
  let { path, name, metadata, code, ...dots } = args;

  /*access_type <- if (!is.null(access_type <- dots[["access_type"]])) {
    match.arg(access_type, c("acl", "logged_in", "all"))
  } else {
    NULL
  }*/

  const tempDir = fileSystem.path(fileSystem.tempfile(), name);

  fileSystem.dir.create(tempDir, { recursive: true });
  // on.exit(unlink(tempDir, { recursive: true }));

  const xPath = fileSystem.dirname(path, 'data\\.rds');

  // const x = xPath === 'data.rds' ? readRDS(xPath) : path;
  let nameQualified = '';

  if (new RegExp('/').test(name)) {
    nameQualified = name;
    name = nameQualified.replace('.*/', '');
  } else {
    nameQualified = `${board.account}/${name}`;
  }

  let accountName = board.account;

  if (board.outputFiles) {
    accountName = 'https://rstudio-connect-server/content/app-id';
  }

  fileSystem.copy(fileSystem.dirname(path), tempDir);

  let dataFiles = null;

  try {
    // dataFiles = rsconnectBundleCreate(x, tempDir, name, board, accountName, code);
  } catch (_) {}

  // handle unexepcted failures gracefully
  if (!dataFiles) {
    console.warning('Falied to create preview files for pin.');
    unlink(tempDir, { recursive: true });
    fileSystem.dir.create(tempDir, { recursive: true });
    fileSystem.copy(fileSystem.dirname(path), tempDir);

    // dataFiles = rsconnectBundleCreateDefault(x, tempDir, name, board, accountName);
  }

  const rsconnectIsAuthenticated = (board) => board.key || board.account;

  if (board.outputFiles) {
    const deps = rsconnectDependencies();
    const knitPinDir = fileSystem.path(name);

    // fileSystem.copy(tempDir, getwd(), { recursive: true });

    deps.outputMetadata.set({
      rscOutputFiles: fileSystem.path(
        knitPinDir,
        fileSystem.dirname(knitPinDir)
      ),
    });
  } else {
    let previous_versions = null;

    const existing = {}; // rsconnectGetByName(board, nameQualified);

    let content = {};
    let guid = null;

    if (!existing.length) {
      /*
      const content = rsconnectApiPost(board, '/__api__/v1/experimental/content', {
        appMode: 'static',
        contentCategory: 'pin',
        name,
        description: boardMetadataToText(metadata, metadata.description),
      });
      */

      if (content.error) {
        pinLog(`Failed to create pin with name '${name}.`);
        throw new Error(`Failed to create pin ${content.error}`);
      }

      guid = content.guid;
    } else {
      guid = existing.guid;

      // when versioning is turned off we also need to clean up previous bundles so we store the current versions
      if (!boardVersionsEnabled(board, true)) {
        // previousVersions = boardPinVersions(board, nameQualified);
      }

      /*
      content = rsconnectApiPost(board, `/__api__/v1/experimental/content/${guid}`, {
        appMode: 'static',
        contentCategory: 'pin',
        name,
        description: boardMetadataToText(metadata, metadata.description),
        accessType,
      });
      */

      if (content.error) {
        pinLog(`Failed to update pin with GUID '${guid}' and name '${name}'.`);
        throw new Error(`Failed to create pin ${content.error}`);
      }
    }

    const files = fileSystem.dir
      .list(tempDir, { recursive: true, fullNames: true })
      .map((path) => ({
        // checksum: rsconnectBundleFileMd5(path),
      }));

    // names(files) = dir(tempDir, { recursive: true });

    const manifest = {
      version: 1,
      locale: 'en_US',
      platform: '3.5.1',
      metadata: {
        appmode: 'static',
        primaryRmd: null,
        primaryHtml: 'index.html',
        contentCategory: 'pin',
        hasParameters: false,
      },
      packages: null,
      files,
      users: null,
    };

    // bundle = rsconnectBundleCompress(tempDir, manifest);

    const upload = {};
    /*
    const upload = rsconnectApiPost(
      board,
      `/__api__/v1/experimental/content/${guid}/upload,
      httr::upload_file(fileSystem.normalizePath(bundle)
    );
    */
    // TODO:
    // progress = http_utils_progress("up", size = file.info(normalizePath(bundle))$size)

    if (upload.error) {
      // before we fail, clean up rsconnect content
      rsconnectApiDelete(board, `/__api__/v1/experimental/content/${guid}`);
      throw new Error(`Failed to upload pin ${upload.error}`);
    }

    const result = {};
    /*
    let result = rsconnectApiPost(
      board,
      `/__api__/v1/experimental/content/${guid}/deploy`,
      { bundleId: upload.bundleId }
    );
    */

    if (result.error) {
      throw new Error(`Failed to activate pin ${result.error}`);
    }

    // it might take a few seconds for the pin to register in rsc, see travis failures, wait 5s
    // result = rsconnectWaitByName(board, nameQualified);

    // when versioning is turned off we also need to clean up previous bundles
    if (!boardVersionsEnabled(board, true) && previousVersions) {
      for (let idx = 1; idx < previousVersions.length; idx++) {
        const deleteVersion = previousVersions[idx];
        const deletePath = `/__api__/v1/experimental/bundles/${deleteVersion.version}`;

        pinLog(`Deleting previous version ${deletePath}.`);
        // rsconnectApiDelete(board, deletePath);
      }
    }

    return result;
  }
};
