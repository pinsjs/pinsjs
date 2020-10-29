import callbacks from './callbacks';

export const userCacheDir = (name) => {
  return callbacks.get('userCacheDir')(name);
};
