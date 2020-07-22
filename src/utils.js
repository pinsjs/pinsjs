export const pinsShowProgress = ({ size: 0 }) => {
  if (typeof size === 'string') size = parseInt(size);

  var largeFile = getOption('pins.progress.size', 10 ^ 7);
  identical(getOption('pins.progress', size > largeFile), true) &&
    interactive();
};

export const pinsSaveCsv = (x, name) => {
  var supportedColumns = [
    'character',
    'numeric',
    'integer',
    'date',
    'logical',
    'raw',
  ];

  // x_class = unname(sapply(x, function(e) class(e)[[1]]))
  // unsupported_columns = which(!x_class %in% supported_columns)
  for (col_idx in unsupported_columns) {
    x[[col_idx]] = as.character(x[[col_idx]]);
  }

  utils::write.csv(x, name, (row.names = FALSE));
};

export const pinsSafeCsv = (x, name) => {
  try {
    return pinsSaveCsv(x, name);
  } catch (e) {
    warning('Failed to save data frame as CSV file');
  }
};
