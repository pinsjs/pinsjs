import * as fileSystem from './host/file-system';
import callbacks from './host/callbacks';
import { boardGet } from './board';
import { boardInitializeDatatxt } from './board-datatxt';

export const s3Headers = (board, verb, path, file) => {
  const date = new Date().toUTCString();

  // allow full urls to allow arbitrary file downloads
  let bucket = board.bucket;

  if (new RegExp('^https?://').test(path)) {
    const pathNohttp = path.replace('^https?://', '');

    path = pathNohttp.replace('^[^/]+/', '');
    bucket = pathNohttp.replace('//..*', '');
  }

  const content = [
    verb,
    '',
    'application/octet-stream',
    date,
    fileSystem.path(`/${bucket}`, path),
  ].join('\n');

  const crypto = callbacks.get('crypto');
  const hash = crypto.HmacSHA1(content, board.secret || '');
  const signature = hash.toString(crypto.enc.Base64);

  const headers = {
    Host: `${bucket}.${board.host}`,
    Date: date,
    'Content-Type': 'application/octet-stream',
    Authorization: `AWS ${board.key}:${signature}`,
  };

  // TODO: for testing, remove
  console.log('------- s3 headers -------');
  console.log(headers);
  console.log('------- string to sign -------');
  console.log(content);

  return headers;
};

export const boardInitializeS3 = async (board, args) => {
  const env = callbacks.get('env');
  const {
    bucket = env('AWS_BUCKET'),
    key = env('AWS_ACCESS_KEY_ID'),
    secret = env('AWS_SECRET_ACCESS_KEY'),
    cache,
    host = 's3.amazonaws.com',
    ...params
  } = args;

  board.bucket = bucket;

  if (!bucket) throw new Error("The 's3' board requires a 'bucket' parameter.");
  if (!key) throw new Error("The 's3' board requires a 'key' parameter.");
  if (!secret) throw new Error("The 's3' board requires a 'secret' parameter.");

  const obj = Object.assign({}, params, {
    name: board.name,
    url: `http://${bucket}.${host}`,
    cache,
    headers: s3Headers,
    needsIndex: false,
    key,
    secret,
    bucket,
    connect: false,
    browseUrl: `https://s3.console.aws.amazon.com/s3/buckets/${bucket}/`,
    host,
  });

  await boardInitializeDatatxt(board, obj);

  return boardGet(board.name);
};
