import * as fileSystem from './host/file-system';
import { getFunction } from './host/getFunction';

const rsconnectTokenDependencies = () => ({
  accounts: getFunction('accounts', 'rsconnect'),
  accountInfo: getFunction('accountInfo', 'rsconnect'),
  serverInfo: getFunction('serverInfo', 'rsconnect'),
  signatureHeaders: getFunction('signatureHeaders', 'rsconnect'),
  httpFunction: getFunction('httpFunction', 'rsconnect'),
});

const rsconnectTokenParseUrl = (urlText) => {
  const components = urlText.match(
    /(http|https):\/\/([^:/#?]+)(?::(\\d+))?(.*)/i
  );

  if (components.length === 0) throw new Error(`Invalid url: ${urlText}`);

  return {
    protocol: components[2],
    host: components[3],
    port: components[4],
    path: components[5],
    pathSansApi: url.path.replace('/__api__', ''),
  };
};

export function rsconnectUrlFromPath(board, path) {
  const deps = rsconnectTokenDependencies();

  const serverInfo = deps.serverInfo(board.serverName);
  const service = rsconnectTokenParseUrl(serverInfo.url);

  return `${service.pathSansApi}${path}`;
}

function rsconnectTokenHeaders(board, url, verb, content) {
  const deps = rsconnectTokenDependencies();
  const accountInfo = deps.accountInfo(board.account, board.serverName);

  let contentFile = null;

  if (!content || typeof content !== 'string') {
    contentFile = fileSystem.tempfile();

    fileSystem.write(content, contentFile);
  } else {
    contentFile = content;
  }

  deps.signatureHeaders(accountInfo, verb, url, contentFile);

  fileSystem.dir.remove(contentFile);
}

export function rsconnectTokenInitialize(board) {
  const deps = rsconnectTokenDependencies();

  if (!deps.accounts) {
    throw new Error(
      `RStudio Connect is not registered, please install the 'rsconnect' package or specify an API key.`
    );
  }

  const accounts = deps.accounts();

  if (!accounts) {
    throw new Error(
      'RStudio Connect is not registered, please add a publishing account or specify an API key.'
    );
  }

  if (!board.server) {
    board.serverName = accounts.server[1];
  }

  if (!board.account) {
    board.account = accounts[accounts.server === board.serverName].name;
  }

  if (board.account.length !== 1) {
    throw new Error(
      `Multiple accounts (${board.account.join(
        ', '
      )}) are associated to this server, please specify the correct account parameter in board_register().`
    );
  }

  // always use the url from rstudio to ensure redirects work properly even when the full path is not specified
  board.server = deps.serverInfo(board.serverName).url.replace('/__api__', '');

  return board;
}

export function rsconnectTokenPost(board, path, content, encode) {
  const deps = rsconnectTokenDependencies();

  const serverInfo = deps.serverInfo(board.serverName);
  const parsed = rsconnectTokenParseUrl(serverInfo.url);

  let contentFile, contentType;

  if (typeof content === 'string') {
    contentType = 'application/x-gzip';
    contentFile = content.path;
  } else {
    contentType = 'application/json';
    contentFile = fileSystem.tempfile();
    fileSystem.write(content, contentFile);
  }

  const urlFormPath = rsconnectUrlFromPath(board, path);
  const result = deps.httpFunction()(
    parsed.protocol,
    parsed.host,
    parsed.port,
    'POST',
    urlFormPath,
    rsconnectTokenHeaders(board, urlFormPath, 'POST', content),
    contentType,
    contentFile
  );

  fileSystem.dir.remove(contentFile);

  return result.content;
}
