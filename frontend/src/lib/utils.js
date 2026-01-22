export function capitialize(value) {
  if (!value) return "";

  // if array → take first value
  const str = Array.isArray(value) ? value[0] : value;

  if (typeof str !== "string") return "";

  return str.charAt(0).toUpperCase() + str.slice(1);
}
