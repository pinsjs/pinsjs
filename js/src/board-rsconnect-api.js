import * as requests from './host/requests';

const rsconnectApiAuthHeaders = (board, path, verb, content) => {
  let headers = {};

  if (rsconnectApiAuth(board)) {
    headers.Authorization = `Key ${board.key}`;
  } else {
    headers = rsconnectTokenHeaders(
      board,
      rsconnectUrlFromPath(board, path),
      verb,
      content
    );
  }

  // TODO: class(content)
  // if (content.class !== 'form_file')
  headers['Content-Type'] = 'application/json';

  return headers;
};

export const rsconnectApiGet = async (board, path) => {
  const url = `${board.server}${path}`;

  const fetch = requests.fetch();
  const headers = rsconnectApiAuthHeaders(board, path, 'GET');
  const result = await fetch(url, { headers });

  if (!result.ok) {
    throw new Error(`Failed to retrieve ${url}: ${await result.text()}`);
  }

  return await result.json();
};

export const rsconnectApiAuth = (board) => !!board.key;

export const rsconnectApiVersion = async (board) => {
  const { version } = await rsconnectApiGet(board, '/__api__/server_settings');

  return version;
};
