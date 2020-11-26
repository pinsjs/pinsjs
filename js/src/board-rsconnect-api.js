import * as requests from './host/requests';
import * as signature from './host/signature';
import * as fileSystem from './host/file-system';
import { pinDownload } from './pin-download';
import { rsconnectUrlFromPath } from './board-rsconnect-token';

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

  if (content && typeof content === 'string') {
    headers['Content-Type'] = 'multipart/form-data';
    headers['X-Content-Checksum'] = signature.md5(content);
  } else {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}

export async function rsconnectApiGet(board, path) {
  const url = `${board.server}${path}`;

  const fetch = requests.fetch();
  const headers = rsconnectApiAuthHeaders(board, path, 'GET');

  let result = fetch(url, { method: 'GET', headers });

  if (result.then) {
    result = await result;
  }

  if (!result.ok) {
    const textResult =
      typeof result.text === 'function' ? result.text() : result.text;

    throw new Error(
      `Failed to retrieve ${url}: ${
        textResult.then ? await textResult : textResult
      }`
    );
  }

  const jsonResult = result.json();

  return jsonResult.then ? await jsonResult : jsonResult;
}

export const rsconnectApiPost = async (board, path, content, progress) => {
  const url = `${board.server}${path}`;
  let body = '';

  if (typeof content === 'string') {
    content = fileSystem.read(content, '');
    body = content;
  } else {
    body = JSON.stringify(content)
      .replace(/,/g, ',\n')
      .replace(/{/g, '{\n')
      .replace(/}/g, '\n}');
  }

  const fetch = requests.fetch();
  const headers = rsconnectApiAuthHeaders(board, url, 'POST', content);

  if (rsconnectApiAuth(board)) {
    let result = fetch(url, {
      method: 'POST',
      headers,
      body,
      // TODO: progress
    });
    if (result.then) {
      result = await result;
    }

    if (!result.ok) {
      const textResult =
        typeof result.text === 'function' ? result.text() : result.text;

      return {
        error: `Operation failed with status: ${
          textResult.then ? await textResult : textResult
        }`,
      };
    }

    const jsonResult = result.json();

    return jsonResult.then ? await jsonResult : jsonResult;
  } else {
    rsconnectTokenPost(board, path, content, encode);
  }
};

export const rsconnectApiDelete = async (board, path) => {
  const url = `${board.server}${path}`;
  const fetch = requests.fetch();
  const headers = rsconnectApiAuthHeaders(board, path, 'DELETE');

  let result = fetch(url, { method: 'DELETE', headers });

  if (result.then) {
    result = await result;
  }

  if (!result.ok) {
    throw new Error(`Failed to delete ${path}: ${testResult}`);
  }
};

export const rsconnectApiDownload = async (board, name, path, etag) => {
  const url =
    path.indexOf(board.server) === 0 ? path : `${board.server}${path}`;
  const headers = rsconnectApiAuthHeaders(board, path, 'GET');

  return await pinDownload(url, {
    name,
    component: board,
    headers,
    customEtag: etag,
  });
};

export const rsconnectApiAuth = (board) => !!board.key;

export async function rsconnectApiVersion(board) {
  const { version } = await rsconnectApiGet(board, '/__api__/server_settings');

  return version;
}
