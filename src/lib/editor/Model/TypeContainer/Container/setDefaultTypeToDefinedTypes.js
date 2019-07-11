export default function(definedTypes, id) {
  definedTypes.forEach((definedType) => {
    if (definedType.id === id) {
      definedType.default = true
    } else if (definedType.default) {
      delete definedType.default
    }
  })
}
