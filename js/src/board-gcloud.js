import * as requests from './host/requests';
import * as fileSystem from './host/file-system';
import callbacks from './host/callbacks';
import { guessType } from './utils/mime';
import { boardInitializeDatatxt } from './board-datatxt';
import { boardDatatxtHeaders } from './board-datatxt-headers';

const gcloudCandidates = (binary) => {
  const env = callbacks.get('env');
  const which = callbacks.get('which');
  const platform = callbacks.get('platform')();

  if (platform === 'win32') {
    const appdata = fileSystem.normalizePath(env('localappdata'), {
      winslash: '/',
    });
    const binaryName = `${binary}.cmd`;
    const sdkPath = fileSystem.path(
      'Google/Cloud SDK/google-cloud-sdk/bin',
      binaryName
    );

    return [
      () => fileSystem.path(appdata, sdkPath),
      () => fileSystem.path(env('ProgramFiles'), sdkPath),
      () => fileSystem.path(env('ProgramFiles(x86)'), sdkPath),
    ];
  } else {
    const binaryName = binary;

    return [
      () => which(binaryName),
      () => `~/google-cloud-sdk/bin/${binaryName}`,
      () =>
        fileSystem.path(
          env('GCLOUD_INSTALL_PATH') || '~/google-cloud-sdk',
          fileSystem.path('bin', binaryName)
        ),
    ];
  }
};

const gcloudBinary = () => {
  const pathEnv = callbacks.get('env')('gcloud.binary.path');
  const pathOption = callbacks.get('getOption')('gcloud.binary.path');
  const userPath = pathEnv ? pathEnv : pathOption ? pathOption : '';

  if (userPath) {
    return fileSystem.normalizePath(userPath);
  }

  const candidates = gcloudCandidates('gcloud');

  candidates.forEach((candidate) => {
    if (fileSystem.fileExists(candidate())) {
      return fileSystem.normalizePath(candidate());
    }
  });

  return null;
};

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
    console.warning(
      `Failed to update data.txt metadata: ${await response.text()}`
    );
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
  const env = callbacks.get('env');
  const {
    bucket = env('GCLOUD_STORAGE_BUCKET'),
    token = env('GOOGLE_STORAGE_ACCESS_TOKEN'),
    cache,
    ...params
  } = args;

  if (!bucket) throw new Error("Board 'gcloud' requires a 'bucket' parameter.");

  if (!token) {
    const gcloud = gcloudBinary();

    if (gcloud) {
      token = callbacks.get('exec')(`${gcloud} 'auth', 'print-access-token'`);
    } else {
      throw new Error(
        "Board 'gcloud' requires an 'access' parameter with a Google Cloud Access Token."
      );
    }
  }

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
