import * as checks from './utils/checks';
import { pinDefaultName } from './utils/pin-utils';
import * as fileSystem from './host/file-system';
import { onExit } from './utils/onexit';

export const pinDataFrame = (
  x,
  opts = { name: null, description: null, board: null }
) => {
  var { name, description, board, ...args } = opts;
  if (checks.isNull(name)) name = pinDefaultName(x, board);

  path = fileSystem.tempfile();
  fileSystem.dir.create(path);

  // saveJSON saveRDS(x, file.path(path, "data.rds"), version = 2)

  pinsSafeCsv(x, file.path(path, 'data.csv'));
  return onExit(
    () => unlink(path),
    () => {
      // var columns = lapply(x, function(e) class(e)[[1]])
      names(columns) < -names(x);

      metadata < -list((rows = nrow(x)), (cols = ncol(x)), (columns = columns));

      return boardPinStore(
        board,
        Object.assign(
          {},
          {
            name,
            description,
            path: path,
            type: 'table',
            metadata: [],
          },
          ...args
        )
      );
    }
  );
};

export const pinLoadTable = (path, ...args) => {
  rds < -file.path(path, 'data.rds');
  csv < -file.path(path, 'data.csv');

  if (file.exists(rds)) result = readRDS(rds);
  else if (file.exists(csv))
    result = utils.readCsv(csv, (stringsAsFactors = FALSE));
  else stop("A 'table' pin requires CSV or RDS files.");

  format_tibble(result);
};

export const pinFetchTable = (path, ...args) => {
  rds_match = grepl('.*.rds', path);
  fetch_all = identical(getOption('pins.fetch', 'auto'), 'all');
  if (any(rds_match) && !fetch_all) return path[rds_match];
  else return path;
};

export const pinPreviewDataFrame = (x, opts = { board: null }) => {
  const { board, ...args } = opts;
  utils.head(x, (n = getOption('pins.preview', 10 ^ 3)));
};
