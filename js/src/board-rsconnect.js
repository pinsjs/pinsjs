import * as fileSystem from './host/file-system';
import * as options from './host/options';
import callbacks from './host/callbacks';
import { dataFrame } from './utils/dataframe';
import { getFunction } from './host/getFunction';
import { onExit } from './utils/onexit';
import { pinLog } from './log';
import { boardVersionsEnabled, pinVersionsPathName } from './versions';
import {
  rsconnectApiAuth,
  rsconnectApiVersion,
  rsconnectApiGet,
  rsconnectApiPost,
  rsconnectApiDelete,
  rsconnectApiDownload,
} from './board-rsconnect-api';
import { rsconnectTokenInitialize } from './board-rsconnect-token';
import { boardPinVersions, boardEmptyResults } from './board-extensions';
import {
  boardMetadataToText,
  boardMetadataFromText,
  boardMetadataRemove,
} from './board-metadata';
import { pinManifestDownload, pinManifestGet } from './pin-manifest';
import {
  pinContentName,
  pinResultsExtractColumn,
  pinResultsFromRows,
} from './pin-tools';
import {
  rsconnectBundleCreate,
  rsconnectBundleCreateDefault,
  rsconnectBundleCompress,
  rsconnectBundleFileMd5,
} from './board-rsconnect-bundle';

const rsconnectDependencies = () => ({
  outputMetadata: getFunction('output_metadata', 'rmarkdown'),
});

async function rsconnectPinsSupported(board) {
  const version = await rsconnectApiVersion(board);

  return version > '1.7.7';
}

const rsconnectGetByName = async (board, name) => {
  const onlyName = pinContentName(name);
  let details = await boardPinFindRSConnect(board, onlyName, { name });

  if (details.length > 1) {
    const ownerDetails = details[details.ownerUsername === board.account];

    if (ownerDetails.length === 1) {
      details = ownerDetails;
    } else {
      const names = details.map((d) => d.name).join("', '");

      throw new Error(
        `Multiple pins named '${name}' in board '${board.name}', choose from: '${names}'.`
      );
    }
  }

  details = details.length === 1 ? details[0] : details;

  details = pinResultsExtractColumn(details, 'content_category');
  details = pinResultsExtractColumn(details, 'url');
  details = pinResultsExtractColumn(details, 'guid');

  return details;
};

const rsconnectWaitByName = async (board, name) => {
  const maxWaitTime = options.getOption('pins.rsconnect.wait', 5);
  let waitTime = 0;
  let value = await rsconnectGetByName(board, name);

  while (!value && waitTime < maxWaitTime) {
    waitTime += 1;
    value = await rsconnectGetByName(board, name);
  }
};

const rsconnectRemotePathFromUrl = (board, url) => {
  url = url.replace('^https?://', '');

  const server = board.server.replace('^https?://', '');

  url = url.replace(`^.*${server}`, '');
  return url.replace('/$', '');
};

export async function boardInitializeRSConnect(board, args) {
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
}

export async function boardPinCreateRSConnect(
  board,
  path,
  name,
  metadata,
  args
) {
  const { code, ...dots } = args;
  let accessType = dots.accessType;

  if (accessType) {
    const valid = ['acl', 'logged_in', 'all'].includes(accessType);

    if (!valid) {
      accessType = null;
    }
  }

  const tempDir = fileSystem.path(fileSystem.tempfile(), name);

  fileSystem.dir.create(tempDir, { recursive: true });

  const xPath = fileSystem.dirname(path, 'data\\.rds');
  const x = xPath === 'data.rds' ? callbacks.get('readRDS')() : path;

  let nameQualified = '';
  let accountName = '';

  if (new RegExp('/').test(name)) {
    nameQualified = name;
    name = nameQualified.replace('.*/', '');
    accountName = nameQualified.replace('/.*', '');

    if (new RegExp('/').test(name) || new RegExp('/').test(accountName)) {
      throw new Error('Pin names must follow the user/name convention.');
    }
  } else {
    nameQualified = `${board.account}/${name}`;
    accountName = board.account;
  }

  if (board.outputFiles) {
    accountName = 'https://rstudio-connect-server/content/app-id';
  }

  fileSystem.copy(fileSystem.dirname(path), tempDir);

  let dataFiles = null;

  try {
    dataFiles = rsconnectBundleCreate(
      x,
      tempDir,
      name,
      board,
      accountName,
      code
    );
  } catch (_) {}

  // handle unexpected failures gracefully
  if (!dataFiles) {
    pinLog('Falied to create preview files for pin.');
    fileSystem.dir.remove(tempDir, { recursive: true });
    fileSystem.dir.create(tempDir, { recursive: true });
    fileSystem.copy(fileSystem.dirname(path), tempDir);

    dataFiles = rsconnectBundleCreateDefault(
      x,
      tempDir,
      name,
      board,
      accountName
    );
  }

  const rsconnectIsAuthenticated = (board) => board.key || board.account;

  if (board.outputFiles) {
    const deps = rsconnectDependencies();
    const knitPinDir = fileSystem.path(name);

    fileSystem.copy(tempDir, '/', { recursive: true });

    deps.outputMetadata.set({
      rscOutputFiles: fileSystem.path(
        knitPinDir,
        fileSystem.dirname(knitPinDir)
      ),
    });
  } else {
    const existing = await rsconnectGetByName(board, nameQualified);

    let content = {};
    let guid = null;
    let previousVersions = null;

    // TODO: when do rows and columns props appear in metadata?
    const description = boardMetadataToText(metadata, metadata.description);

    if (!existing || !existing.guid) {
      const content = await rsconnectApiPost(
        board,
        '/__api__/v1/experimental/content',
        {
          app_mode: 'static',
          content_category: 'pin',
          name,
          description,
        }
      );

      if (content.error) {
        pinLog(`Failed to create pin with name '${name}.`);
        throw new Error(`Failed to create pin: ${content.error}`);
      }

      guid = content.guid;
    } else {
      guid = existing.guid;

      // when versioning is turned off we also need to clean up previous bundles so we store the current versions
      if (!boardVersionsEnabled(board, true)) {
        previousVersions = boardPinVersionsRSConnect(board, nameQualified);
      }

      content = await rsconnectApiPost(
        board,
        `/__api__/v1/experimental/content/${guid}`,
        {
          app_mode: 'static',
          content_category: 'pin',
          name,
          description,
          access_type: accessType,
        }
      );

      if (content.error) {
        pinLog(`Failed to update pin with GUID '${guid}' and name '${name}'.`);
        throw new Error(`Failed to create pin ${content.error}`);
      }
    }

    const files = fileSystem.dir
      .list(tempDir, { recursive: true, fullNames: true })
      .map((path) => ({ checksum: rsconnectBundleFileMd5(path) }));

    const manifest = {
      version: 1,
      locale: 'en_US',
      platform: '3.5.1',
      metadata: {
        appmode: 'static',
        primary_rmd: null,
        primary_html: 'index.html',
        content_category: 'pin',
        has_parameters: false,
      },
      packages: null,
      files,
      users: null,
    };

    const bundle = await rsconnectBundleCompress(tempDir, manifest);

    // TODO
    // progress = http_utils_progress("up", size = file.info(normalizePath(bundle))$size)
    const upload = await rsconnectApiPost(
      board,
      `/__api__/v1/experimental/content/${guid}/upload`,
      fileSystem.normalizePath(bundle)
    );

    if (upload.error) {
      throw new Error(`Failed to upload pin ${upload.error}`);
    }

    let result = await rsconnectApiPost(
      board,
      `/__api__/v1/experimental/content/${guid}/deploy`,
      { bundle_id: upload.bundleId }
    );

    if (result.error) {
      throw new Error(`Failed to activate pin ${result.error}`);
    }

    // it might take a few seconds for the pin to register in rsc, see travis failures, wait 5s
    await rsconnectWaitByName(board, nameQualified);

    // when versioning is turned off we also need to clean up previous bundles
    if (!boardVersionsEnabled(board, true) && previousVersions) {
      for (let idx = 1; idx < previousVersions.length; idx++) {
        const deleteVersion = previousVersions[idx];
        const deletePath = `/__api__/v1/experimental/bundles/${deleteVersion.version}`;

        pinLog(`Deleting previous version ${deletePath}.`);
        await rsconnectApiDelete(board, deletePath);
      }
    }

    fileSystem.dir.remove(tempDir, { recursive: true });

    return result;
  }
}

export const boardPinFindRSConnect = async (board, text = '', args) => {
  let { name, allContent = false, extended = false, metadata = false } = args;

  if (name) {
    text = pinContentName(name);
  }

  const filter = `search=${text}`;

  let contentFilter = '';

  if (board.pinsSupported) {
    contentFilter = 'filter=content_type:pin&';
  }

  let entries = (
    await rsconnectApiGet(
      board,
      `/__api__/applications/?${contentFilter}${encodeURI(filter)}`
    )
  ).applications;

  if (!allContent) {
    entries = entries.filter((e) => e.content_category === 'pin');
  }

  entries = entries.map((e) => {
    e.name = `${e.owner_username}/${e.name}`;
    return e;
  });

  if (name) {
    const namePattern = new RegExp('/').test(name) ? `^${name}$` : `.*${name}$`;

    entries = entries.filter((e) => new RegExp(namePattern).test(e.name));
  }

  const results = pinResultsFromRows(entries);

  if (!results.length) {
    return boardEmptyResults();
  }

  results.forEach((r) => {
    r.type = boardMetadataFromText(r.description).type || 'files';
    if (metadata) {
      r.metadata = boardMetadataFromText(r.description);
    }
    r.description = boardMetadataRemove(r.description);
  });

  if (entries.length === 1) {
    const manifest = {};

    if (metadata) {
      // enhance with pin information
      const remotePath = rsconnectRemotePathFromUrl(board, entries[0].url);
      const etag = entries[0].last_deployed_time;

      localPath = await rsconnectApiDownload(
        board,
        entries[0].name,
        fileSystem.path(remotePath, 'data.txt'),
        etag
      );
      manifest = pinManifestGet(localPath);
    }

    if (extended) {
      manifest = [entries[0], manifest];
    }

    results[0].type = manifest.type;

    if (metadata) {
      results[0].metadata = manifest;
    }
  }

  return results;
};

export const boardPinGetRSConnect = async (board, name, { ...args }) => {
  const { version } = args;
  let url = name;

  if (board.outputFiles) {
    return name;
  }

  let etag = '';
  if (!new RegExp('^http://|^https://|^/content/').test(name)) {
    const details = await rsconnectGetByName(board, name);

    if (!details) {
      throw new Error(
        `The pin '${name}' is not available in the '${board.name}' board.`
      );
    }

    url = details.url || details.metadata.url;
    name = details.name;

    etag = details.metadata.last_deployed_time;
  }

  let remotePath = rsconnectRemotePathFromUrl(board, url);
  let downloadName = name;

  if (version) {
    remotePath = `${remotePath}/_rev${version}`;
    downloadName = fileSystem.path(
      name,
      fileSystem.path(pinVersionsPathName(), version)
    );
  }

  const localPath = await rsconnectApiDownload(
    board,
    downloadName,
    fileSystem.path(remotePath, 'data.txt'),
    etag
  );

  const manifestPaths = pinManifestDownload(localPath) || [];

  for (let i = 0; i < manifestPaths.length; i++) {
    await rsconnectApiDownload(
      board,
      downloadName,
      fileSystem.path(remotePath, manifestPaths[i]),
      etag
    );
  }

  const toDelete = fileSystem.dir
    .list(localPath, { fullNames: true })
    .filter((f) => new RegExp(`index\\.html$|pagedtable-1\\.1$`).test(f));

  fileSystem.dir.remove(toDelete);

  return localPath;
};

export const boardPinRemoveRSConnect = async (board, name) => {
  let details = await rsconnectGetByName(board, name);
  details = pinResultsExtractColumn(details, 'guid');

  await rsconnectApiDelete(
    board,
    fileSystem.path('/__api__/v1/experimental/content/', details.guid)
  );
};

export async function boardPinVersionsRSConnect(board, name) {
  const details = await rsconnectGetByName(board, name);

  if (!details) {
    throw new Error(
      `The pin '${name}' is not available in the '${board.name}' board.`
    );
  }

  const bundles = await rsconnectApiGet(
    board,
    `/__api__/v1/experimental/content/${details.guid}/bundles/`
  );

  return dataFrame({
    version: bundles.results.map((e) => e.id),
    created: bundles.results.map((e) => e.created_time),
    size: bundles.results.map((e) => e.size),
    stringsAsFactors: false,
  });
}
