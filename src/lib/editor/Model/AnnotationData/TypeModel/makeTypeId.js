const typeCounter = []

// The ID of type has number of type.
// This IDs are used for id of DOM element and css selector for jQuery.
// But types are inputed by users and may have `!"#$%&'()*+,./:;<=>?@[\]^`{|}~` which can not be used for css selecor.
export default function(entity) {
  const attrs = entity.attributes.map((a) => a.pred + a.obj).join(',')
  const key = `${entity.type.name}${attrs}`
  if (typeCounter.indexOf(key) === -1) {
    typeCounter.push(key)
  }
  return `${entity.span}-${typeCounter.indexOf(key)}`
}
