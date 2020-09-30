import * as requests from './host/requests';
import { guessType } from './utils/mime';
import { boardDatatxtHeaders } from './board-datatxt-headers';

const gcloudIndexUpdated = async (board) => {
  const metadata = {
    cacheControl: 'private, max-age=0, no-transform',
    name: 'data.txt',
  };
  const fetch = requests.fetch();
  const response = await fetch(
    `https://storage.googleapis.com/storage/v1/b/${board.bucket}./o/${data.txt}`,
    Object.assign(
      { method: 'PATCH', body: metadata },
      boardDatatxtHeaders(board, 'o/data.txt', 'PATCH')
    )
  );

  if (!response.ok) {
    // TODO: show meaningful message
    console.warning(`Failed to update data.txt metadata: ${response}`);
  }
};

export const gcloudHeaders = (board, verb, path, file) => {
  let contentType = null;

  if (file) {
    contentType = guessType(file);
  }

  const headers = {
    Authorization: `Bearer ${board.token}`,
    'Content-Type': contentType,
  };

  return headers;
};

export const boardInitializeGCloud = async (board, args) => {
  const { bucket, token, cache, ...params } = args;

  if (!bucket) throw new Error("Board 'gcloud' requires a 'bucket' parameter.");

  if (!token)
    // TODO: can be gcloud.binary.path in env file
    throw new Error(
      "Board 'gcloud' requires an 'access' parameter with a Google Cloud Access Token."
    );

  const gcloudUrl = `https://storage.googleapis.com/${bucket}`;
  const obj = Object.assign({}, params, {
    name: board.name,
    url: gcloudUrl,
    headers: gcloudHeaders,
    cache,
    bucket,
    token,
    browse_url: `https://console.cloud.google.com/storage/browser/${bucket}`,
    indexRandomize: true,
    indexUpdated: gcloudIndexUpdated,
  });

  await boardInitializeDatatxt(board, obj);

  return boardGet(board.name);
};
