const HOST_CALLBACKS = {};

export const get = (name) => {
  if (Object.keys(HOST_CALLBACKS).includes(name)) return HOST_CALLBACKS[name];
  else return (...args) => null;
};

export const set = (name, callback) => {
  HOST_CALLBACKS[name] = callback;
};

export default {
  get,
  set,
};
