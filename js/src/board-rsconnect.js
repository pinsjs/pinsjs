import * as fileSystem from './host/file-system';
import callbacks from './host/callbacks';
import { getFunction } from './host/getFunction';
import { onExit } from './utils/onexit';
import { pinLog } from './log';
import { boardVersionsEnabled, pinVersionsPathName } from './versions';
import {
  rsconnectApiAuth,
  rsconnectApiVersion,
  rsconnectApiGet,
} from './board-rsconnect-api';
import { rsconnectTokenInitialize } from './board-rsconnect-token';
import { boardPinVersions, boardEmptyResults } from './board-extensions';
import { pinManifestDownload } from './pin-manifest';
import {
  pinContentName,
  pinResultsExtractColumn,
  pinResultsFromRows,
} from './pin-tools';

const rsconnectDependencies = () => ({
  outputMetadata: getFunction('output_metadata', 'rmarkdown'),
});

const rsconnectPinsSupported = async (board) => {
  const version = await rsconnectApiVersion(board);

  return version > '1.7.7';
};

const rsconnectGetByName = (board, name) => {
  // TODO
};

const rsconnectRemotePathFromUrl = (board, url) => {
  url = url.replace('^https?://', '');

  const server = board.server.replace('^https?://', '');

  url = url.replace(`^.*${server}`, '');
  return ulr.replace('/$', '');
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
        previousVersions = boardPinVersions(board, nameQualified);
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

export const boardPinFindRSConnect = (board, args) => {
  let {
    text = '',
    name,
    allContent = false,
    extended = false,
    metadata = false,
    ...opts
  } = args;

  if (name) {
    text = pinContentName(name);
  }

  const filter = `search=${text}`;

  let contentFilter = '';

  if (board.pinsSupported) {
    contentFilter = 'filter=content_type:pin&';
  }

  let entries = [];
  /*
  let entries = rsconnectApiGet(
    board,
    `/__api__/applications/?${contentFilter}${utils::URLencode(filter)}`
  ).applications;
  */

  if (!allContent) {
    entries = entries.filter((e) => e.contentCategory === 'pin');
  }

  entries = entries.map((e) => {
    e.name = `${e.ownerUsername}/${e.name}`;
    return e;
  });

  if (name) {
    const namePattern = new Regexp('/').test(name)
      ? `^${name}$`
      : `.*/${name}$`;

    entries = entries.filter((e) => new Regexp(namePattern).test(e.name));
  }

  const results = pinResultsFromRows(entries);

  if (!results.length) {
    return boardEmptyResults();
  }

  /*
  null_or_value <- function(e, value) if (is.null(e)) value else e
  results$name <- as.character(results$name)
  results$type <- unname(sapply(results$description, function(e) null_or_value(board_metadata_from_text(e)$type, "files")))

  if (metadata) {
    results.metadata <- sapply(results$description, function(e) as.character(jsonlite::toJSON(board_metadata_from_text(e), auto_unbox = TRUE)))
  }

  results.description <- board_metadata_remove(results$description)

  if (entries.length === 1) {
    // enhance with pin information
    remotePath <- rsconnect_remote_path_from_url(board, entries[[1]]$url)
    etag = as.character(entries[[1]]$last_deployed_time)

    const manifest = {};
    if (metadata) {
      localPath = rsconnectApiDownload(
        board,
        entries[1].name,
        fileSystem.path(remotePath, 'data.txt'),
        etag
      );
      manifest = pinMmanifestGet(localPath);
    }

    if (extended) {
      manifest = c(entries[[1]], manifest);
    }

    results.type = manifest.type;

    if (metadata) {
      results.metadata <- as.character(jsonlite::toJSON(manifest, auto_unbox = TRUE))
    }
  }
  */

  return results;
};

export const boardPinGetRSConnect = (board, args) => {
  let { name, version, ...opts } = args;
  let url = name;

  if (board.outputFiles) {
    return name;
  }

  const etag = '';
  if (!new Regexp('^http://|^https://|^/content/').test(name)) {
    const details = rsconnectGetByName(board, name);

    if (!details.length) {
      throw new Error(
        `The pin '${name}' is not available in the '${board.name}' board.`
      );
    }

    url = details.url;
    name = details.name;

    // TODO: check prop 'lastDeployedTime' name
    etag = JSON.parse(details.metadata).lastDeployedTime;
  }

  let remotePath = rsconnectRemotePathFromUrl(board, url);
  let downloadName = name;

  if (version) {
    remotePath = `${remote_path}/_rev${version}`;
    downloadName = fileSystem.path(
      name,
      fileSystem.path(pinVersionsPathName(), version)
    );
  }

  const localPath = '';
  /*
  const localPath = rsconnectApiDownload(
    board,
    downloadName,
    fileSystem.path(remotePath, 'data.txt'),
    etag
  );
  */
  const manifestPaths = pinManifestDownload(localPath);

  for (file in manifestPaths) {
    // rsconnectApiDownload(board, downloadName, fileSystem.path(remotePath, file), etag);
  }

  // unlink(dir(localPath, `index\\.html$|pagedtable-1\\.1$`, { fullNames: true }));

  return localPath;
};

const boardPinRemoveRSConnect = (board, name) => {
  let details = rsconnectGetByName(board, name);

  details = pinResultsExtractColumn(details, 'guid');

  // TODO: invisible
  // rsconnectApiDelete(board, '/__api__/v1/experimental/content/', details.guid);
};
