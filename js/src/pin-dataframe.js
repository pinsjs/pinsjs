import * as checks from './utils/checks';
import { pinDefaultName } from './utils/pin-utils';
import { readCsv } from './utils/csv';
import * as fileSystem from './host/file-system';
import { onExit } from './utils/onexit';
import { pinsSafeCsv } from './utils';
import { dfColNames } from './utils/dataframe';
import { boardPinStore } from './pin-extensions';

export async function pinDataFrame(
  x,
  opts = { name: null, description: null, board: null }
) {
  var { name, description, board, ...args } = opts;
  if (checks.isNull(name)) name = pinDefaultName(x, board);

  var path = fileSystem.tempfile();
  fileSystem.dir.create(path);

  fileSystem.write(JSON.stringify(x), fileSystem.path(path, 'data.json'));

  pinsSafeCsv(x, fileSystem.path(path, 'data.csv'));

  return await onExit(
    () => unlink(path),
    async () => {
      const columns = dfColNames(x);
      const metadata = {
        rows: x.length,
        cols: columns.length,
        columns: columns,
      };

      return await boardPinStore(
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
}

export function pinLoadTable(path, ...args) {
  var json = fileSystem.path(path, 'data.json');
  var csv = fileSystem.path(path, 'data.csv');
  var result = null;

  if (fileSystem.fileExists(json)) {
    result = JSON.parse(fileSystem.readLines(json).join('\n\r'));
  } else if (fileSystem.fileExists(csv)) {
    result = readCsv(
      fileSystem
        .readLines(csv)
        .filter((l) => l)
        .join('\n')
    );
  } else {
    throw new Error("A 'table' pin requires CSV or JSON files.");
  }

  return result;
}

export function pinFetchTable(path, ...args) {
  rds_match = grepl('.*.rds', path);
  fetch_all = identical(getOption('pins.fetch', 'auto'), 'all');
  if (any(rds_match) && !fetch_all) return path[rds_match];
  else return path;
}

export function pinPreviewDataFrame(x, opts = { board: null }) {
  const { board, ...args } = opts;
  utils.head(x, (n = getOption('pins.preview', Math.pow(10, 3))));
}
