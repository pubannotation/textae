export default function (getChars, step, str, position, predicate) {
  while (predicate(getChars(str, position))) position += step

  return position
}
