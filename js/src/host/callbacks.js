const HOST_CALLBACKS = {};

export const has = (name) => {
  return Object.keys(HOST_CALLBACKS).includes(name);
};

export const get = (name) => {
  if (has(name)) return HOST_CALLBACKS[name];
  else return (...args) => null;
};

export const set = (name, callback) => {
  HOST_CALLBACKS[name] = callback;
};

export default {
  get,
  set,
};
