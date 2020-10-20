import * as appdirs from './host/appdirs';
import * as options from './host/options';

export function boardCachePath() {
  return options.getOption('pins.path', appdirs.userCacheDir('pins'));
};
