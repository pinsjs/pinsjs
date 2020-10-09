import * as requests from './host/requests';

const rsconnectApiAuthHeaders = (board, path, verb, content) => {
  let headers = {};

  if (rsconnectApiAuth(board)) {
    headers.Authorization = `Key ${board.key}`;
  } else {
    // TODO
    // headers = rsconnectTokenHeaders(board, rsconnectUrlFromPath(board, path), verb, content);
  }

  // TODO: class(content)
  if (content.class === 'form_file') {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

export const rsconnectApiGet = async (board, path) => {
  const url = `${board.server}${path}`;
  const fetch = requests.fetch();
  const result = await fetch(url, rsconnectApiAuthHeaders(board, path, 'GET'));

  if (!result.ok) {
    throw new Error(`Failed to retrieve ${url}: ${await result.text()}`);
  }

  return await result.text();
};

export const rsconnectApiAuth = (board) => !!board.key;

export const rsconnectApiVersion = async (board) =>
  await rsconnectApiGet(board, '/__api__/server_settings').version;
