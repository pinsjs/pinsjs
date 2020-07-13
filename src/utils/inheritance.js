const METHODS = {};
const DEFAULT_CLASS_NAME = 'default';

export const registerMethod = (methodName, className, method) => {
  METHODS[methodName] = METHODS[methodName] || {};
  METHODS[methodName][className] = method;

  return method;
};

export const useMethod = (methodName, object, ...args) => {
  const className = (object && object.class
    ? object.class
    : object.constructor && object.constructor.name
    ? object.constructor.name
    : DEFAULT_CLASS_NAME
  ).toLowerCase();

  // support to construct objects by wrrapping object in content/class dictionary
  if (typeof object['_content'] !== 'undefined') {
    object = object['_content'];
  }

  if (METHODS[methodName] && METHODS[methodName][className]) {
    return METHODS[methodName][className](object, ...args);
  }

  if (METHODS[methodName] && METHODS[methodName]['default']) {
    return METHODS[methodName]['default'](object, ...args);
  }

  throw new Error(
    `no applicable method for '${methodName}' applied to an object of class '${className}'`
  );
};
