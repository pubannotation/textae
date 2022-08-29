export default function (attribute, attributeContainer) {
  const { pred, obj } = attribute
  const { valueType } = attributeContainer.get(pred)

  switch (valueType) {
    case 'string':
      // In the case of String attributes,
      // Labels completed by autocomplete can be reflected in attribute definitions.
      // We want to keep the label in the attribute hash until we press the OK button.
      return attribute.label || attributeContainer.getLabel(pred, obj) || ''
    case 'selection':
    case 'numeric':
    case 'flag':
      // In the case of Selection or Numeric or flag attributes,
      // we want to refer only to the label of the attribute definition.
      return attributeContainer.getLabel(pred, obj) || ''
    default:
      throw `unknown attribute type: ${valueType}`
  }
}
