// When you select multiple entities and display the edit dialog,
// this is used to display the merged type name and attributes.
export default function(entities) {
  const summary = {
    name: '',
    attributes: []
  }

  for (const { type } of entities) {
    summary.name = type.name

    for (const attribute of type.attributes) {
      if (!summary.attributes.some((a) => a.pred === attribute.pred)) {
        summary.attributes.push(attribute)
      }
    }
  }

  return summary
}
