export default function(container, newDefinedTypes) {
  // expected newDefinedTypes is an array of object. example of object is {"name": "Regulation","color": "#FFFF66","default": true}.
  if (newDefinedTypes !== undefined) {
    container.setDefinedTypes(newDefinedTypes)

    const defaultFromDefinedTypes = newDefinedTypes
      .filter((type) => type.default === true)
      .map((type) => type.id)
      .shift()

    if (defaultFromDefinedTypes) {
      container.setDefaultType(defaultFromDefinedTypes)
    }
  }
}
