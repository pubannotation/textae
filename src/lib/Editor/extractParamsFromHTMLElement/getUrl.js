export default function (source) {
  if (source) {
    return decodeURIComponent(source)
  }

  return ''
}
