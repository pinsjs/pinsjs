import * as callbacks from './callbacks';

export function getFunction(name, packageName) {
  return callbacks.get('getFunction')(name, packageName);
};
