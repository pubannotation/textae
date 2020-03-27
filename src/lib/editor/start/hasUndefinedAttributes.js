export default function(annotation, config) {
  if (annotation.attributes) {
    if (!config) {
      return `attribute definitions for "${[
        ...new Set(annotation.attributes.map((a) => a.pred))
      ].join(', ')}" in configuration is missing. `
    }

    const atrributeTypes = config['attribute types'] || []

    const attributesWithoutDefenition = annotation.attributes.filter(
      (attr) => !atrributeTypes.some((attrDef) => attrDef.pred === attr.pred)
    )

    if (attributesWithoutDefenition.length) {
      console.warn('attributes without definition', attributesWithoutDefenition)
      return `attribute definition for "${attributesWithoutDefenition
        .map((a) => a.pred)
        .join(', ')}" in configuration is missing. `
    }

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
