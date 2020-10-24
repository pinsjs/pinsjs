export function boardDatatxtHeaders(board, path, verb = 'GET', file) {
  if (board.url) {
    // remove base url form path since S3 and others require relative paths when using custom domains
    path = path.replace(`^${board.url}/?`, '');
  }

  if (typeof board.headers === 'function') {
    return board.headers(board, verb, path, file);
  } else if (
    (board.headers &&
      (board.headers.length ||
        typeof board.headers === 'string' ||
        board.headers['request'])) ||
    !board.headers
  ) {
    return board.headers;
  } else {
    throw `Unsupported class for board headers: ${typeof board.headers}`;
  }
}
