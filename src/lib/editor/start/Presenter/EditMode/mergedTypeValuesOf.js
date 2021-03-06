import TypeValues from '../../../TypeValues'

// When you select multiple entities and display the edit dialog,
// this is used to display the merged type name and attributes.
export default function (entities) {
  const { typeName } = entities[entities.length - 1]

  const attributes = []
  for (const { typeValues } of entities) {
    for (const attribute of typeValues.attributes) {
      if (!attributes.some((a) => a.equalsTo(attribute.pred, attribute.obj))) {
        attributes.push(attribute)
      }
    }
  }

  return new TypeValues(typeName, attributes)
}
