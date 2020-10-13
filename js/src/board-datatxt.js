import yaml from 'js-yaml';
import * as fileSystem from './host/file-system';
import * as requests from './host/requests';
import * as versions from './versions';
import { boardDatatxtHeaders } from './board-datatxt-headers';
import { boardCachePath } from './board-registration';
import { boardLocalStorage } from './board-storage';
import {
  boardManifestGet,
  boardManifestLoad,
  boardManifestCreate,
} from './board-manifest';
import { pinStoragePath } from './pin-registry';
import {
  pinManifestGet,
  pinManifestDownload,
  pinManifestCreate,
  pinManifestMerge,
} from './pin-manifest';
import { pinDownload } from './pin-download';
import { boardVersionsExpand } from './versions';

const datatxtRefreshIndex = async (board) => {
  if (!board.url) {
    throw new Error(`Invalid 'url' in '${board.name}' board.`);
  }

  let indexFile = 'data.txt';

  if (board.indexRandomize) {
    indexFile += `?rand=${Math.round(Math.random() * 1e8)}`;
  }

  const indexUrl = fileSystem.path(board.url, indexFile);
  const fetch = requests.fetch();

  const headers = boardDatatxtHeaders(board, 'data.txt');

  const data = await fetch(indexUrl, { headers }).then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to retrieve data.txt file from ${board.url}.`);
    } else {
      return response.text();
    }
  });

  const tempfile = fileSystem.tempfile();

  fileSystem.dir.create(tempfile);
  fileSystem.write(data, tempfile);

  const localIndex = fileSystem.path(boardLocalStorage(board), 'data.txt');

  let currentIndex = boardManifestGet(localIndex, true);
  let newIndex = boardManifestGet(tempfile);

  newIndex = newIndex.map((newEntry) => {
    const currentEntry = currentIndex.filter((ci) => ci.path === newEntry.path);

    if (currentEntry.length == 1) {
      newEntry.cache = currentEntry[0].cache;
    }

    return newEntry;
  });

  currentIndex = newIndex;

  const yamlText = yaml.safeDump(currentIndex);

  fileSystem.writeLines(localIndex, yamlText.split('\n'));
};

const datatxtPinDownloadInfo = (board, name, args) => {
  let index = boardManifestGet(
    fileSystem.path(boardLocalStorage(board), 'data.txt')
  );

  index = index.filter((v) => v.name === name);

  if (!index.length && board.needsIndex) {
    throw new Error(`Could not find '${name}' pin in '${board.name}' board.`);
  }

  // if there is no index, fallback to downloading data.txt for the pin,
  // this can happen with incomplete indexes.
  const indexEntry = index.length ? index[0] : { path: name };

  // try to download index as well
  let pathGuess = new RegExp('.*/.*\\.[a-zA-Z]+$').test(indexEntry.path)
    ? fileSystem.dirname(indexEntry.path)
    : indexEntry.path;

  // if 'pathGuess' already has a scheme, don't prepend board URL
  pathGuess = new RegExp('^https?://').test(pathGuess)
    ? pathGuess
    : fileSystem.path(board.url, pathGuess);

  return { pathGuess, indexEntry };
};

const datatxtRefreshManifest = async (board, name, download, args) => {
  const { pathGuess, indexEntry } = datatxtPinDownloadInfo(board, name, args);
  const downloadPath = fileSystem.path(pathGuess, 'data.txt');

  await pinDownload(downloadPath, {
    name,
    component: board,
    canFail: true,
    download,
    headers: boardDatatxtHeaders(board, downloadPath),
  });

  return { pathGuess, indexEntry, downloadPath };
};

const datatxtUploadFiles = async ({ board, name, files, path }) => {
  for (const file of files) {
    const subpath = fileSystem.path(name, file).replace(/\/\//g, '/');
    const uploadUrl = fileSystem.path(board.url, subpath);
    const filePath = fileSystem.normalizePath(fileSystem.path(path, file));

    const fetch = requests.fetch();

    // TODO: show progress
    // http_utils_progress("up", size = file.info(file_path)$size)
    const data = fileSystem.read(filePath);
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: data,
      headers: boardDatatxtHeaders(board, subpath, 'PUT', filePath),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to upload '${file}' to '${uploadUrl}'. Error: ${response.statusText}`
      );
    }
  }
};

const datatxtUpdateIndex = async ({
  board,
  path,
  operation,
  name,
  metadata,
}) => {
  let indexFile = 'data.txt';
  const indexUrl = fileSystem.path(board.url, indexFile);

  let indexFileGet = 'data.txt';

  if (board.indexRandomize) {
    // some boards cache bucket files by default which can be avoided by changing the url
    indexFileGet = `${indexFile}?rand=${(Math.random() * 10) ^ 8}`;
  }

  const fetch = requests.fetch();
  const getResponse = await fetch(fileSystem.path(board.url, indexFileGet), {
    headers: boardDatatxtHeaders(board, indexFileGet),
  });

  let index = [];

  if (getResponse.ok) {
    index = boardManifestLoad(await getResponse.text());
  } else {
    if (operation === 'remove') {
      throw new Error(
        'Failed to retrieve latest data.txt file, the pin was partially removed.'
      );
    }
  }

  const indexMatches = index.map((i) => i.path === path);

  let indexPos = indexMatches.length
    ? indexMatches.filter((i) => i)
    : index.length;

  if (!indexPos.length) {
    indexPos = index.length;
  }

  if (operation === 'create') {
    Object.keys(metadata).forEach((key) => {
      if (!metadata[key]) metadata[key] = null;
    });
    metadata.columns = null;

    index[indexPos] = { path };

    if (name) {
      index[indexPos].name = name;
    }

    Object.assign(index[indexPos], ...metadata);
  } else if (operation === 'remove') {
    if (indexPos <= index.length) {
      index[indexPos] = null;
    }
  } else {
    throw new Error(`Operation ${operation} is unsupported.`);
  }

  indexFile = fileSystem.path(boardLocalStorage(board), 'data.txt');

  boardManifestCreate(index, indexFile);

  const normalizedFile = fileSystem.normalizePath(indexFile);
  const data = fileSystem.read(normalizedFile);
  const putResponse = await fetch(indexUrl, {
    method: 'PUT',
    body: data,
    headers: boardDatatxtHeaders(board, 'data.txt', 'PUT', normalizedFile),
  });

  if (!putResponse.ok) {
    throw new Error(
      `Failed to update data.txt file: ${await putResponse.text()}`
    );
  }

  if (board.indexUpdated && operation === 'create') {
    board.indexUpdated(board);
  }
};

const datatxtPinFiles = async (board, name) => {
  const entry = boardPinFindDatatxt(board, board.name, { metadata: true });

  if (entry.length !== 1) {
    throw new Error(`Pin '${name}' not found.`);
  }

  const metadata = results[0]['metadata'];

  let files = metadata.path;

  metadata.versions.forEach(async (version) => {
    const pathGuess = datatxtPinDownloadInfo(board, name).pathGuess;
    const downloadPath = fileSystem.path(
      fileSystem.path(pathGuess, version),
      'data.txt'
    );
    const localPath = fileSystem.path(pinStoragePath(board, name), version);
    const subpath = fileSystem.path(name, version);

    await pinDownload(downloadPath, {
      name,
      component: board,
      canFail: true,
      headers: boardDatatxtHeaders(board, downloadPath),
      subpath,
    });

    const manifest = pinManifestGet(localPath);

    files = files.concat([
      fileSystem.path(subpath, manifest.path),
      fileSystem.path(subpath, 'data.txt'),
    ]);
  });

  return files;
};

export const boardInitializeDatatxt = async (board, args) => {
  const {
    url,
    browseUrl,
    headers,
    bucket,
    indexUpdated,
    indexRandomize = false,
    needsIndex = true,
    cache = boardCachePath(),
    ...params
  } = args;

  if (!url) {
    throw new Error("The 'datatxt' board requires a 'url' parameter.");
  }

  board.url = url.replace(/(\/)?data.txt$/g, '');
  board.headers = headers;
  board.needsIndex = needsIndex;
  board.browseUrl = browseUrl || url;
  board.indexUpdated = indexUpdated;
  board.bucket = bucket;
  board.indexRandomize = indexRandomize;

  Object.keys(params).forEach((key) => {
    board[key] = params[key];
  });

  await datatxtRefreshIndex(board);

  return board;
};

export const boardPinGetDatatxt = async (board, name, args) => {
  const { extract, version, download = true, ...opts } = args;
  const manifestPaths = await datatxtRefreshManifest(
    board,
    name,
    download,
    opts
  );

  const { indexEntry } = manifestPaths;
  let pathGuess = manifestPaths.pathGuess;
  let downloadPath = manifestPaths.downloadPath;
  let localPath = pinStoragePath(board, name);
  let manifest = pinManifestGet(localPath);

  if (version) {
    if (!manifest.versions.includes(version)) {
      version = boardVersionsExpand(manifest.versions, version);
    }

    downloadPath = fileSystem.path(
      pathGuess,
      fileSystem.path(version, 'data.txt')
    );
    localPath = fileSystem.path(localPath, version);

    await pinDownload(downloadPath, {
      name,
      component: board,
      canFail: true,
      headers: boardDatatxtHeaders(board, downloadPath),
      subpath: fileSystem.path(name, version),
    });

    manifest = pinManifestGet(localPath);
    pathGuess = fileSystem.path(pathGuess, version);
  }

  if (manifest) {
    downloadPath = indexEntry.path;

    const pinManifest = pinManifestDownload(localPath);

    if (pinManifest) {
      // we find a data.txt file in subfolder with paths, we use those paths instead of the index paths
      downloadPath = '';

      if (new Regexp('^https?://').test(pinManifest)) {
        downloadPath = pinManifest;
      } else {
        downloadPath = fileSystem.path(pathGuess, pinManifest);
      }
    } else {
      indexEntry.path = null;
      pinManifestCreate(localPath, indexEntry, indexEntry.path);
    }
  } else {
    // attempt to download from path when index not available
    downloadPath = fileSystem.path(board.url, name);
  }

  if (!new RegExp('https?://').test(downloadPath)) {
    downloadPath = fileSystem.path(board.url, downloadPath);
  }

  localPath = await pinDownload(downloadPath, {
    name,
    component: board,
    extract,
    download,
    headers: boardDatatxtHeaders(board, downloadPath),
  });

  return localPath;
};

export const boardPinFindDatatxt = async (board, text, args) => {
  await datatxtRefreshIndex(board);

  const entries = boardManifestGet(
    fileSystem.path(boardLocalStorage(board), 'data.txt')
  );

  if (args.extended) {
    return entries;
  }

  let results = entries.map((e) => ({
    name: e.name || fileSystem.basename(e.path),
    description: e.description || '',
    type: e.type || 'files',
    metadata: e,
    stringsAsFactors: false,
  }));

  if (args.name) {
    results = results.filter((i) => i.name === agrs.name);
  }

  if (results.length === 1) {
    let metadata = JSON.parse(results[0].metadata);
    const pathGuess = new RegExp('\\.[a-zA-Z]+$').test(metadata.path)
      ? fileSystem.dirname(metadata.path)
      : metadata.path;
    const datatxtPath = fileSystem.path(
      board.url,
      fileSystem.path(pathGuess, 'data.txt')
    );

    const response = await fetch(datatxtPath, {
      headers: boardDatatxtHeaders(board, datatxtPath),
    });

    if (response.ok) {
      const pinMetadata = boardManifestLoad(await response.text());
      metadata = pinManifestMerge(metadata, pinMetadata);
      results.metadata = metadata;
    }
  }

  return results;
};

export const boardPinCreateDatatxt = async (
  board,
  path,
  name,
  metadata,
  args
) => {
  versions.boardVersionsCreate(board, name, path);

  // TODO: enable fullNames param in list method
  const uploadFiles = fileSystem.dir
    .list(path, { recursive: true })
    .map((e) => e.split('\\').pop().split('/').pop());

  await datatxtUploadFiles({ board, name, files: uploadFiles, path });
  await datatxtUpdateIndex({
    board,
    path: name,
    operation: 'create',
    name,
    metadata,
  });
};

export const boardPinRemoveDatatxt = async (board, name, args) => {
  const files = datatxtPinFiles(board, name);

  // also attempt to delete data.txt
  files.push(fileSystem.path(name, 'data.txt'));

  const fetch = requests.fetch();

  files.forEach(async (file) => {
    const deleteUrl = fileSystem.path(board.url, file);

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: boardDatatxtHeaders(board, file, 'DELETE'),
    });

    if (!response.ok) {
      console.warning(
        `Failed to remove '${file}' from '${
          board.name
        }' board. Error: ${await response.text()}`
      );
    }
  });

  await datatxtUpdateIndex({ board, path: name, operation: 'remove', name });

  unlink(pinStoragePath(board, name), { recursive: true });
};

export const boardPinVersionsDatatxt = async (board, name, args) => {
  const { download = true, ...opts } = args;

  await datatxtRefreshManifest(board, name, download, opts);

  return versions.boardVersionsGet(board, name);
};
