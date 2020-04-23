import * as callbacks from './callbacks';

export const getOption = (name, defval) => {
  var option = callbacks.get('getOption')(name);
  return option != null ? option : defval;
};
