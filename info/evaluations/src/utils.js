export function capitalize(str) {
  return str.replaceAll(/\S+/g, m => m[0].toUpperCase() + m.slice(1).toLowerCase())
}
