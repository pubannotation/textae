// Check for definitions of values for selection attributes.
export default function (annotation, config) {
  console.assert(
    config,
    `If you don't have a configuration, generate a configuration from the annotation.`
  )

  if (annotation.attributes) {
    const atrributeTypes = config['attribute types']

    const selectionAttributeValueWithoutDefinition = annotation.attributes
      .filter((attr) =>
        atrributeTypes.some(
          (attrDef) =>
            attrDef.pred === attr.pred && attrDef['value type'] === 'selection'
        )
      )
      .filter(
        (attr) =>
          !atrributeTypes.some(
            (attrDef) =>
              attrDef.pred === attr.pred &&
              attrDef.values.some((v) => v.id === attr.obj)
          )
      )

    if (selectionAttributeValueWithoutDefinition.length) {
      console.warn(
        'selection attribute values without definition',
        selectionAttributeValueWithoutDefinition
      )

      return `selection attribute value definition for "${selectionAttributeValueWithoutDefinition
        .map((a) => a.obj)
        .join(', ')}" in configuration is missing. `
    }
  }
}
