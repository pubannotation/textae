export default function (src, prefix) {
  // An id will be generated if id is null.
  // But an undefined is convert to string as 'undefined' when it add to any string.
  return src.id ? prefix + src.id : null
}
