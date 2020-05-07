import { getOption } from './host/options';
import callbacks from './host/callbacks';
import { pinLog } from './log';

export const pinLog = (...args) => {
  if (getOption('pins.verbose', true)) {
    callbacks.get('pinLog')(args.join(''));
  }
};
