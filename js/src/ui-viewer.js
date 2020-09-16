import * as callbacks from './host/callbacks';

export const uiViewerRegister = (board, boardCall) => {
  callbacks.get('uiViewerRegister')(board, boardCall);
};

export const uiViewerUpdated = (board) => {
  callbacks.get('uiViewerUpdated')(board);
};

export const uiViewerClose = (board) => {
  callbacks.get('uiViewerClose')(board);
};
