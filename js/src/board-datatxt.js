import yaml from 'js-yaml';
import * as fileSystem from './host/file-system';
import * as requests from './host/requests';
import { boardCachePath } from './board-registration';
import { boardLocalStorage } from './board-storage';
import { boardManifestGet } from './board-manifest';

const datatxtRefreshIndex = (board) => {
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
  // TODO: make synchronous method
  fetch(indexUrl)
    .then((response) => response.text())
    .then((data) => {
      const tempfile = fileSystem.tempfile();

      fileSystem.dir.create(tempfile);
      fileSystem.write(data, tempfile);

      const localIndex = fileSystem.path(boardLocalStorage(board), 'data.txt');

      let currentIndex = boardManifestGet(localIndex, true);
      let newIndex = boardManifestGet(tempfile);

      newIndex = newIndex.map((newEntry) => {
        const currentEntry = currentIndex.filter(
          (ci) => ci.path === newEntry.path
        );

        if (currentEntry.length == 1) {
          newEntry.cache = currentEntry[0].cache;
        }

        return newEntry;
      });

      currentIndex = newIndex;

      const yamlText = yaml.safeDump(currentIndex);

      fileSystem.writeLines(localIndex, yamlText.split('\n'));
    })
    .catch((err) => {
      if (board.needsIndex) {
        throw new Error(`Failed to retrieve data.txt file from ${board.url}.`);
      }
    });
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
  // const pathGuess = grepl(".*/.*\\.[a-zA-Z]+$", index_entry$path[1])
  //   ? dirname(index_entry$path[1])
  //   : index_entry$path[1]

  // if 'pathGuess' already has a scheme, don't prepend board URL
  // pathGuess = grepl("^https?://", path_guess)
  //   ? pathGuess
  //   : file.path(board$url, path_guess, fsep = "/")

  // return [{ pathGuess, indexEntry }];
};

const datatxtRefreshManifest = (board, name, download, args) => {
  const { pathGuess, indexEntry } = datatxtPinDownloadInfo(board, name, args);

  const downloadPath = fileSystem.path(pathGuess, 'data.txt');

  /*
  pin_download(download_path,
               name,
               board$name,
               can_fail = TRUE,
               headers = board_datatxt_headers(board, download_path),
               download = download)
  */

  return [{ pathGuess, indexEntry, downloadPath }];
};

export const boardInitializeDatatxt = (board, args) => {
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

  board.url = url.replace(/data.txt$/g, '');
  board.headers = headers;
  board.needsIndex = needsIndex;
  board.browseUrl = browseUrl || url;
  board.indexUpdated = indexUpdated;
  board.bucket = bucket;
  board.indexRandomize = indexRandomize;

  Object.keys(params).forEach((key) => {
    board[key] = params[key];
  });

  datatxtRefreshIndex(board);

  return board;
};

export const boardPinGetDatatxt = (board, name, args) => {
  const { extract, version, download = true, ...opts } = args;
  const manifestPaths = datatxtRefreshManifest(board, name, download, opts);
};
