export const onExit = (...args) => {
  var error = null;
  var result = null;

  try {
    result = args[args.length - 1]();
  } catch (err) {
    error = err;
  }

  for (var idx = 0; idx < args.length - 2; idx++) args[idx]();

  if (error !== null) throw error;

  return result;
};
