export const tryCatch = async (expr, error) => {
  try {
    return !!expr.then ? await expr() : expr();
  } catch (err) {
    return error(err);
  }
};

export const tryCatchNull = (expr, error) => {
  return tryCatch(expr, () => null);
};
