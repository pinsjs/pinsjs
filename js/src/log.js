import { getOption } from './host/options';
import callbacks from './host/callbacks';

export const pinLog = (...args) => {
  if (getOption('pins.verbose', true)) {
    callbacks.get('pinLog')(args.join(''));
  }
};

export const pinDebug = (method, params) => {
  if (getOption('pins.verbose', true)) {
    callbacks.get('pinLog')('Calling ' + method + '(' + JSON.stringify(params) + ')');
  }
};
