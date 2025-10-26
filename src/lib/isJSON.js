export default function (arg) {
  if (typeof arg !== 'string') {
    return false
  }

  try {
    JSON.parse(arg)
  } catch (_e) {
    return false
  }

  return true
}
