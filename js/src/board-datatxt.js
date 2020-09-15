import yaml from 'js-yaml';
import * as fileSystem from './host/file-system';
import * as requests from './host/requests';
import { boardCachePath } from './board-registration';
import { boardLocalStorage } from './board-storage';
import { boardManifestGet } from './board-manifest';
import { pinStoragePath } from './pin-registry';
import {
  pinManifestGet,
  pinManifestDownload,
  pinManifestCreate,
} from './pin-manifest';
import { pinDownload } from './pin-download';

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

  // TODO: set fetch headers from `board_datatxt_headers(board, "data.txt")`
  const data = await fetch(indexUrl).then((response) => {
    if (!response.ok && board.needsIndex) {
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

  let indexEntry = null;

  if (index.length) {
    indexEntry = index[0];
  } else {
    // if there is no index, fallback to downloading data.txt for the pin,
    // this can happen with incomplete indexes.
    indexEntry = [{ path: name }];
  }

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

  // TODO: fix pathGuess - there is no data.txt in iris/ folder
  const downloadPath = fileSystem.path(pathGuess.slice(0, -6), 'data.txt');

  // TODO: headers: boardDatatxtHeaders(board, downloadPath)
  await pinDownload(downloadPath, {
    name,
    component: board,
    canFail: true,
    download,
  });

  // TODO: should be array?
  return { pathGuess, indexEntry, downloadPath };
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
  let downloadPath = manifestPaths.downloadPath;
  let localPath = pinStoragePath(board, name);
  const manifest = pinManifestGet(localPath);

  if (version) {
    // TODO: versions
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

  // TODO: headers: boardDatatxtHeaders(board, downloadPath)
  localPath = await pinDownload(downloadPath, {
    name,
    component: board,
    extract,
    download,
  });

  return localPath;
};

export const boardPinFindDatatxt = async (board, text, args) => {
  await datatxtRefreshIndex(board);

  const entries = boardManifestGet(
    fileSystem.path(boardLocalStorage(board), 'data.txt')
  );

  if (extended) {
    return null; //pin_entries_to_dataframe(entries);
  }

  console.log(entries);

  /*
  results <- data.frame(
    name = sapply(entries, function(e) if (is.null(e$name)) basename(e$path) else e$name),
    description = sapply(entries, function(e) if (is.null(e$description)) "" else e$description),
    type = sapply(entries, function(e) if (is.null(e$type)) "files" else e$type),
    metadata = sapply(entries, function(e) jsonlite::toJSON(e, auto_unbox = TRUE)),
    stringsAsFactors = FALSE)

  if (is.character(name)) {
    results <- results[results$name == name,]
  }

  if (nrow(results) == 1) {
    metadata <- jsonlite::fromJSON(results$metadata)
    path_guess <- if (grepl("\\.[a-zA-Z]+$", metadata$path)) dirname(metadata$path) else metadata$path
    datatxt_path <- file.path(board$url, path_guess[[1]], "data.txt")

    response <- httr::GET(datatxt_path, board_datatxt_headers(board, datatxt_path))
    if (!httr::http_error(response)) {
      pin_metadata <- board_manifest_load(datatxt_response_content(response))

      metadata <- pin_manifest_merge(metadata, pin_metadata)

      results$metadata <- jsonlite::toJSON(metadata, auto_unbox = TRUE)
    }
  }

  results
  */
};
