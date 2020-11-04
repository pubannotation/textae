export default function (obj) {
  if (obj === true) {
    return 'flag'
  } else if (typeof obj === 'number') {
    return 'numeric'
  } else if (typeof obj === 'string') {
    return 'string'
  } else {
    throw `${JSON.stringify(obj)} is an unexpected value for an Attribute.`
  }
}
