const HOST_CALLBACKS = {};

export const get = (name) => {
  var callback = HOST_CALLBACKS[name];

  if (callback) return callback;
  else return (...args) => null;
};

export const set = (name, callback) => {
  HOST_CALLBACKS[name] = callback;
};

export default {
  get,
  set,
};
