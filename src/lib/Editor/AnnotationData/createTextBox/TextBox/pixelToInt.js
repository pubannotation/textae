export default function (str) {
  // The default value of google chrome line-height is "normal".
  // "normal" cannot be converted to an integer.
  const i = parseInt(str, 10)
  return isNaN(i) ? 0 : i
}
