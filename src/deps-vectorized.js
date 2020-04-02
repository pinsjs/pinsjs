function vectorized__first(obj) {
  if (Array.isArray(obj)) return obj[0];

  return obj;
}
