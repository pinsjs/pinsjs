import * as requests from './host/requests';
import { pinDownload } from './pin-download';

function rsconnectApiAuthHeaders(board, path, verb, content) {
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
  if (!content || content.class !== 'form_file') {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}

export async function rsconnectApiGet(board, path) {
  const url = `${board.server}${path}`;

  const fetch = requests.fetch();
  const headers = rsconnectApiAuthHeaders(board, path, 'GET');
  const result = await fetch(url, { headers });

  if (!result.ok) {
    throw new Error(`Failed to retrieve ${url}: ${await result.text()}`);
  }

  return await result.json();
}

export const rsconnectApiPost = async (
  board,
  path,
  content,
  encode,
  progress
) => {
  const url = `${board.server}${path}`;

  // TODO: class.content
  // encode = content.class === 'form_file' ? 'multipart' : 'raw';

  const fetch = requests.fetch();
  const body = JSON.stringify(content)
    .replace(/,/g, ',\n')
    .replace(/{/g, '{\n')
    .replace(/}/g, '\n}');
  const headers = rsconnectApiAuthHeaders(board, url, 'POST', content);

  if (rsconnectApiAuth(board)) {
    const result = await fetch(url, {
      method: 'POST',
      headers,
      body,
      // TODO: progress, encode
    });

    if (!result.ok) {
      return {
        error: `Operation failed with status ${
          result.statusCode
        }: ${await result.text()}`,
      };
    }

    return await result.json();
  } else {
    // TODO: rsconnect_token_post(board, path, content, encode)
  }
};

export const rsconnectApiDelete = async (board, path) => {
  const url = `${board.server}${path}`;
  const fetch = requests.fetch();
  const headers = rsconnectApiAuthHeaders(board, path, 'DELETE');

  const result = await fetch(url, { method: 'DELETE', headers });

  if (!result.ok) {
    throw new Error(`Failed to delete ${path}: ${await result.text()}`);
  }

  return await result.json();
};

export const rsconnectApiDownload = async (board, name, path, etag) => {
  const url = `${board.server}${path}`;

  return await pinDownload(url, {
    name,
    component: board,
    headers: rsconnectApiAuthHeaders(board, path, 'GET'),
    customEtag: etag,
  });
};

export const rsconnectApiAuth = (board) => !!board.key;

export async function rsconnectApiVersion(board) {
  const { version } = await rsconnectApiGet(board, '/__api__/server_settings');

  return version;
}
