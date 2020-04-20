import system from './system';
import { getOption } from './host/options';

export const pinLog = (...args) => {
  if (getOption('pins.verbose', false)) {
    system.message(...args);
  }
};
