import { getOption } from './host/options';
import callbacks from './host/callbacks';

export const pinLog = (...args) => {
  if (getOption('pins.verbose', true)) {
    callbacks.get('pinLog')(args.join(''));
  }
};
