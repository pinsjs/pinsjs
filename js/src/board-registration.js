import * as appdirs from './host/appdirs';
import * as options from './host/options';

export const boardCachePath = () => {
  return options.getOption('pins.path', appdirs.userCacheDir('pins'));
};
