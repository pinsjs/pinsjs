import * as fileSystem from './host/file-system';
import { getFunction } from './host/getFunction';

const rsconnectTokenDependencies = () => ({
  accounts: getFunction('accounts', 'rsconnect'),
  accountInfo: getFunction('accountInfo', 'rsconnect'),
  serverInfo: getFunction('serverInfo', 'rsconnect'),
  signatureHeaders: getFunction('signatureHeaders', 'rsconnect'),
  httpFunction: getFunction('httpFunction', 'rsconnect'),
});

const rsconnectTokenHeaders = (board, url, verb, content) => {
  const deps = rsconnectTokenDependencies();
  const accountInfo = deps.accountInfo(board.account, board.serverName);

  let contentFile = null;

  // TODO: class(content)
  if (content.class === 'form_file') {
    contentFile = content.path;
  } else if (content) {
    if (typeof content !== 'string') {
      throw new Error(`Unsupported object of class ${content.class}`);
    }
    contentFile = fileSystem.tempfile();
    // TODO:
    // on.exit(unlink(content_file))
    // writeChar(content, content_file, eos = NULL, useBytes = TRUE)
  }

  deps.signatureHeaders(accountInfo, verb, url, contentFile);
};

export const rsconnectTokenInitialize = (board) => {
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
};
