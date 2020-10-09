import * as requests from './host/requests';
import * as signature from './host/signature';
import * as fileSystem from './host/file-system';
import callbacks from './host/callbacks';
import { boardInitializeDatatxt } from './board-datatxt';

export const dospacesHeaders = (board, verb, path, file) => {
  const date = new Date().toUTCString();

  // allow full urls to allow arbitrary file downloads
  let space = board.space;

  if (new RegExp('^https?://').test(path)) {
    const pathNohttp = path.replace('^https?://', '');
    const path = pathNohttp.replace('^[^/]+/', '');

    space = pathNohttp.replace('\\..*', '');
  }

  const content = [
    verb,
    '',
    'application/octet-stream',
    date,
    fileSystem.path(space, path),
  ].join('\n');

  const crypto = callbacks.get('crypto');
  const hash = crypto.HmacSHA1(content, board.secret || '');
  const signature = hash.toString(crypto.enc.Base64);

  const headers = {
    Host: `${space}.${board.datacenter}.${board.host}`,
    Date: date,
    'Content-Type': 'application/octet-stream',
    Authorization: `AWS ${board.key}:${signature}`,
  };

  return headers;
};

export const boardInitializeDospaces = async (board, args) => {
  const env = callbacks.get('env');
  const {
    space = env('DO_SPACE'),
    key = env('DO_ACCESS_KEY_ID'),
    secret = env('DO_SECRET_ACCESS_KEY'),
    datacenter = env('DO_DATACENTER'),
    cache,
    host = 'digitaloceanspaces.com',
    ...params
  } = args;

  if (!space)
    throw new Error("The 'dospace' board requires a 'space' parameter.");
  if (!key) throw new Error("The 'dospace' board requires a 'key' parameter.");
  if (!secret)
    throw new Error("The 'dospace' board requires a 'secret' parameter.");
  if (!datacenter)
    throw new Error("The 'dospace' board requires a 'datacenter' parameter.");

  board.space = space;

  const dospacesUrl = `https://${board.space}.${datacenter}.${host}`;
  const obj = Object.assign({}, params, {
    name: board.name,
    url: dospacesUrl,
    cache,
    headers: dospacesHeaders,
    key,
    secret,
    space,
    datacenter,
    browseUrl: `https://cloud.digitalocean.com/spaces/${space}`,
    host,
  });

  await boardInitializeDatatxt(board, obj);

  return boardGet(board.name);
};
