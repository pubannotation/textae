import FlagAttributeDefinition from './FlagAttributeDefinition'
import NumericAttributeDefinition from './NumericAttributeDefinition'
import SelectionAttributeDefinition from './SelectionAttributeDefinition'
import StringAttributeDefinition from './StringAttributeDefinition'
import AttributeDefinition from './AttributeDefinition'

export default function (valueType, hash) {
  if (hash instanceof AttributeDefinition) {
    throw new Error(
      `Give me hash object instead of an AttributeDefinition instance`
    )
  }

  switch (valueType) {
    case 'flag':
      return new FlagAttributeDefinition(valueType, hash)
    case 'numeric':
      return new NumericAttributeDefinition(valueType, hash)
    case 'selection':
      return new SelectionAttributeDefinition(valueType, hash)
    case 'string':
      return new StringAttributeDefinition(valueType, hash)
    default:
      throw new Error(
        `${valueType} of ${JSON.stringify(hash)} is Uknown Attribute`
      )
  }
}
