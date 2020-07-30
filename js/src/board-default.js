import * as options from './host/options';

export const boardDefault = () => {
  return options.getOption('pins.board', 'local');
};
