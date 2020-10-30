import * as fileSystem from './host/file-system';
import { pinLog } from './log';

export function pinsShowProgress(opts = { size: 0 }) {
  var { size } = opts;
  if (typeof size === 'string') size = parseInt(size);

  var largeFile = getOption('pins.progress.size', 10 ^ 7);
  identical(getOption('pins.progress', size > largeFile), true) &&
    interactive();
}

export function pinsSaveCsv(x, name) {
  if (x.length > 0) {
    const columns = Object.keys(x[0]).join(',');
    fileSystem.writeLines(name, columns);
  }

  const rows = x.map((row) => {
    return Object.keys(row)
      .map((key) => row[key])
      .join(',');
  });

  fileSystem.writeLines(name, rows);
}

export function pinsSafeCsv(x, name) {
  try {
    return pinsSaveCsv(x, name);
  } catch (e) {
    pinLog('Failed to save data frame as CSV file: ' + e);
  }
}
