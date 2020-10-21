import { getOption } from './host/options';
import callbacks from './host/callbacks';

export const pinLog = (...args) => {
  if (getOption('pins.verbose', true)) {
    callbacks.get('pinLog')(args.join(''));
  }
};

export const pinDebug = (params) => {
  if (getOption('pins.debug', true)) {
    callbacks.get('pinLog')(
      '  '.repeat(params.level) + params.name + '(' + JSON.stringify(params) + ')'
    );
  }
};
