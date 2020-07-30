import * as callbacks from './callbacks';
import * as checks from '../utils/checks';

export const getOption = (name, defval) => {
  var option = callbacks.get('getOption')(name);
  return !checks.isNull(option) ? option : defval;
};
