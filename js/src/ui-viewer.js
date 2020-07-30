import * as callbacks from './host/callbacks';

export const uiViewerRegister = (board, boardCall) => {
  callbacks.get('uiViewerRegister')();
};

export const uiViewerUpdated = (board) => {
  callbacks.get('uiViewerUpdated')();
};
