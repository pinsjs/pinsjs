import * as options from './host/options';

export function boardDefault() {
  return options.getOption('pins.board', 'local');
}
