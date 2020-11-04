export default function (arg) {
  if (typeof arg !== 'string') {
    return false
  }

  try {
    JSON.parse(arg)
  } catch (e) {
    return false
  }

  return true
}
