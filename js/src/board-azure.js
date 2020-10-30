import * as fileSystem from './host/file-system';
import callbacks from './host/callbacks';
import { guessType } from './utils/mime';
import { boardGet } from './board';
import { boardInitializeDatatxt } from './board-datatxt';

export function azureHeaders(board, verb, path, file) {
  const date = new Date().toUTCString();
  const azureVersion = '2015-04-05';

  // allow full urls to allow arbitrary file downloads
  let container = board.container;
  let account = board.account;

  if (new RegExp('^https?://').test(path)) {
    const pathNohttp = path.replace('^https?://', '');
    const subPath = pathNohttp.replace('^[^/]+/', '');

    account = pathNohttp.replace('\\..*', '');
    path = subPath.replace('^[^/]+/', '');
    container = subPath.replace('/.*', '');
  }

  let contentLength = '';
  let contentType = '';

  if (file) {
    contentLength = fileSystem.fileSize(file);
    contentType = guessType(file);
  }

  const content = [
    verb,
    '\n',
    contentLength,
    '',
    contentType,
    '\n\n\n\n\n',
    'x-ms-blob-type:BlockBlob',
    `x-ms-date:${date}`,
    `x-ms-version:${azureVersion}`,
    `/${account}/${container}/${path}`,
  ].join('\n');

  const sha1 = callbacks.get('sha1');
  const signature = sha1(content, board.secret || '');

  const headers = {
    'x-ms-date': date,
    'x-ms-version': azureVersion,
    'x-ms-blob-type': 'BlockBlob',
    Authorization: `SharedKey ${account}:${signature}`,
  };

  return headers;
}

export async function boardInitializeAzure(board, args) {
  const env = callbacks.get('env');
  const {
    container = env('AZURE_STORAGE_CONTAINER'),
    account = env('AZURE_STORAGE_ACCOUNT'),
    key = env('AZURE_STORAGE_KEY'),
    cache,
    ...params
  } = args;

  if (!container)
    throw new Error("The 'azure' board requires a 'container' parameter.");
  if (!account)
    throw new Error("The 'azure' board requires an 'account' parameter.");
  if (!key) throw new Error("The 'azure' board requires a 'key' parameter.");

  const azureUrl = `https://${account}.blob.core.windows.net/${container}`;
  const obj = Object.assign({}, params, {
    name: board.name,
    url: azureUrl,
    cache,
    headers: azureHeaders,
    needsIndex: false,
    container,
    account,
    key,
    connect: false,
    browseUrl: 'https://portal.azure.com',
  });

  await boardInitializeDatatxt(board, obj);

  return boardGet(board.name);
}
