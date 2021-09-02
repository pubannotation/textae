import TypeValues from '../../editorize/TypeValues'

// When you select multiple entities and display the edit dialog,
// this is used to display the merged type name and attributes.
export default function (entities) {
  const { typeName } = entities[entities.length - 1]

  const mergedAttributes = []
  for (const { attributes } of entities) {
    for (const attribute of attributes) {
      if (
        !mergedAttributes.some((a) => a.equalsTo(attribute.pred, attribute.obj))
      ) {
        mergedAttributes.push(attribute)
      }
    }
  }

  return new TypeValues(typeName, mergedAttributes)
}
