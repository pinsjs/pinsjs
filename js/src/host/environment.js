const ENVIRONMENT = {};
const GLOBAL_KEY = '__global__';

export function exists(x, { envir = GLOBAL_KEY }) {
  return envir in ENVIRONMENT && x in ENVIRONMENT[envir];
}

export function get(x, options = {}) {
  if (exists(x, options)) {
    const { envir = GLOBAL_KEY } = options;

    return ENVIRONMENT[envir][x];
  }

  throw new Error(`object ${x} not found`);
}

export function get0(x, options = {}) {
  const { ifnotfound } = options;

  return exists(x, options) ? get(x, options) : ifnotfound;
}

export function assign(x, value, { envir = GLOBAL_KEY }) {
  ENVIRONMENT[envir] = ENVIRONMENT[envir] || {};
  ENVIRONMENT[envir][x] = value;
}
