import { getOption } from './host/options';
import callbacks from './host/callbacks';

export const pinLog = (...args) => {
  if (getOption('pins.verbose', true)) {
    callbacks.get('pinLog')(args.join(''));
  }
};

export const pinDebug = (params) => {
  if (getOption('pins.debug', true)) {
    const name = params.name;
    const level = params.level + 1;
    params.level = params.line = params.name = undefined;
    callbacks.get('pinLog')(
      '--'.repeat(level) + name + '(' + JSON.stringify(params) + ')'
    );
  }
};
