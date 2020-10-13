import * as callbacks from './callbacks';

export const getFunction = (name, packageName) => {
  return callbacks.get('getFunction')(name, packageName);
};
