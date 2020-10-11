import callbacks from './host/callbacks';
import {
  rsconnectApiAuth,
  rsconnectApiVersion,
  rsconnectApiGet,
} from './board-rsconnect-api';
import { rsconnectTokenInitialize } from './board-rsconnect-token';

const rsconnectPinsSupported = async (board) => {
  const version = await rsconnectApiVersion(board);

  return packageVersion(version) > packageVersion('1.7.7');
};

export const boardInitializeRSConnect = async (board, args) => {
  const env = callbacks.get('env');
  const envvarKey = env('CONNECT_API_KEY') || env('RSCONNECT_API');

  if (!args.key && envvarKey) {
    args.key = envvarKey;
  }

  const envvarServer = env('CONNECT_SERVER') || env('RSCONNECT_SERVER');

  if (!args.server && envvarServer) {
    args.server = envvarServer;
  }

  if (args.server) {
    board.server = args.server.replace('/$', '');
    board.serverName = args.server.replace('https?://|(:[0-9]+)?/.*', '');
  }

  board.account = args.account;
  board.outputFiles = args.outputFiles;

  if (!args.key) {
    throw new Error('Invalid API key, the API key is empty.');
  }

  board.key = args.key;

  if (board.key && !board.server) {
    throw new Error(
      `Please specify the 'server' parameter when using API keys.`
    );
  }

  if (!rsconnectApiAuth(board) && !board.outputFiles) {
    board = rsconnectTokenInitialize(board);
  }

  try {
    board.pinsSupported = await rsconnectPinsSupported(board);
  } catch (e) {
    board.pinsSupported = false;
  }

  if (!board.account) {
    board.account = rsconnectApiGet(board, '/__api__/users/current/').username;
  }

  return board;
};
