const METHODS = {};
const DEFAULT_CLASS_NAME = 'default';

export const registerMethod = (methodName, className, method) => {
  METHODS[methodName] = METHODS[methodName] || {};
  METHODS[methodName][className] = method;

  return method;
};

export const useMethod = (methodName, object, ...args) => {
  const className =
    object && object.constructor ? object.constructor.name : DEFAULT_CLASS_NAME;

  if (METHODS[methodName] && METHODS[methodName][className]) {
    return METHODS[methodName][className](...args);
  }

  if (METHODS[methodName] && METHODS[methodName]['default']) {
    return METHODS[methodName]['default'](...args);
  }

  throw new Error(
    `no applicable method for '${methodName}' applied to an object of class '${className}'`
  );
};
