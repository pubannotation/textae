export default function(annotation, config) {
  if (annotation.attributes) {
    const attributesWithoutDefenition = annotation.attributes.filter(
      (attr) =>
        !(config['attribute types'] || []).some(
          (attrDef) => attrDef.pred === attr.pred
        )
    )
    if (attributesWithoutDefenition.length) {
      console.warn('attributes without definition', attributesWithoutDefenition)
      return `attribute definition for "${attributesWithoutDefenition
        .map((a) => a.pred)
        .join(', ')}" in configuration is missing. `
    }
  }
}
