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
  fetch(indexUrl)
    .then((response) => response.text())
    .then((data) => {
      const tempfile = fileSystem.tempfile();

      fileSystem.dir.create(tempfile);
      fileSystem.write(data, tempfile);

      const localIndex = fileSystem.path(boardLocalStorage(board), 'data.txt');
      const currentIndex = boardManifestGet(localIndex, true);

      // TODO
      /*
      let newIndex = boardManifestGet(tempfile);

      # retain cache when refreshing board to avoid redownloads after board_register
      new_index <- lapply(new_index, function(new_entry) {
        current_entry <- Filter(function(e) identical(e$path, new_entry$path), current_index)
        if (length(current_entry) == 1) {
          new_entry$cache <- current_entry[[1]]$cache
        }
        new_entry
      })

      currentIndex = newIndex;

      yaml::write_yaml(current_index, local_index)
      */
    })
    .catch((err) => {
      if (board.needsIndex) {
        throw new Error(`Failed to retrieve data.txt file from ${board.url}.`);
      }
    });
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
