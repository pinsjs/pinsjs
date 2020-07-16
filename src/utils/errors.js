export const tryCatch = (expr, error) => {
  try {
    return expr();
  } catch (err) {
    return error(err);
  }
};

export const tryCatchNull = (expr, error) => {
  return tryCatch(expr, () => null);
};
