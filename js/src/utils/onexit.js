const isAsync = (func) => !!func.then;

export const onExit = async (...args) => {
  var error = null;
  var result = null;

  try {
    result = isAsync(args[args.length - 1])
      ? await args[args.length - 1]()
      : args[args.length - 1]();
  } catch (err) {
    error = err;
  }

  for (var idx = 0; idx < args.length - 2; idx++) {
    if (isAsync(args[idx])) await args[idx]();
    else args[idx]();
  }

  if (error) throw error;

  return result;
};
