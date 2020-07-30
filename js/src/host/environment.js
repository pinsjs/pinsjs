const ENVIRONMENT = {};
const GLOBAL_KEY = '__global__';

export const exists = (x, { envir = GLOBAL_KEY }) => {
  return envir in ENVIRONMENT && x in ENVIRONMENT[envir];
};

export const get = (x, options = {}) => {
  if (exists(x, options)) {
    const { envir = GLOBAL_KEY } = options;

    return ENVIRONMENT[envir][x];
  }

  throw new Error(`object ${x} not found`);
};

export const get0 = (x, options = {}) => {
  const { ifnotfound } = options;

  return exists(x, options) ? get(x, options) : ifnotfound;
};

export const assign = (x, value, { envir = GLOBAL_KEY }) => {
  ENVIRONMENT[envir] = ENVIRONMENT[envir] || {};
  ENVIRONMENT[envir][x] = value;
};
