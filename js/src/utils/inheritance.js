import { dfIsDataFrame } from './dataframe';
import { pinLog, pinDebug } from '../log';

const METHODS = {};
const DEFAULT_CLASS_NAME = 'default';

const initializeMethod = (methodName, object, ...args) => {
  pinDebug('useMethod', Object.assign({ object: object }, ...args));

  METHODS[methodName] = METHODS[methodName] || {};

  var className = (object && object.class
    ? object.class
    : object.constructor && object.constructor.name
    ? object.constructor.name
    : DEFAULT_CLASS_NAME
  ).toLowerCase();

  if (dfIsDataFrame(object)) {
    className = 'dataframe';
  }

  // support to construct objects by wrrapping object in content/class dictionary
  if (typeof object['_content'] !== 'undefined') {
    object = object['_content'];
  }

  return { className, object };
};

export const registerMethod = (methodName, className, method) => {
  METHODS[methodName] = METHODS[methodName] || {};
  METHODS[methodName][className] = method;

  return method;
};

export const useMethodAsync = async (methodName, object, ...args) => {
  const init = initializeMethod(methodName, object, ...args);
  const className = init.className;

  object = init.object;

  if (METHODS[methodName] && METHODS[methodName][className]) {
    const result = METHODS[methodName][className](object, ...args);

    if (result && result.then) {
      return await result;
    }
    return result;
  }

  if (METHODS[methodName] && METHODS[methodName]['default']) {
    return METHODS[methodName]['default'](object, ...args);
  }

  throw new Error(
    `no applicable method for '${methodName}' applied to an object of class '${className}'`
  );
};

export function useMethod(methodName, object, ...args) {
  const init = initializeMethod(methodName, object, ...args);
  const className = init.className;

  object = init.object;

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
