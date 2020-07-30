import callbacks from './callbacks';

export const userCacheDir = () => {
  return callbacks.get('userCacheDir')('pins');
};
