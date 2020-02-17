import FlagAttributeDefinition from './FlagAttributeDefinition'
import NumericAttributeDefinition from './NumericAttributeDefinition'
import SelectionAttributeDefinition from './SelectionAttributeDefinition'
import StringAttributeDefinition from './StringAttributeDefinition'
import AttributeDefinition from './AttributeDefinition'

export default function(hash) {
  if (hash instanceof AttributeDefinition) {
    throw new Error(
      `Give me hash object instead of an AttributeDefinition instance`
    )
  }

  switch (hash['value type']) {
    case 'flag':
      return new FlagAttributeDefinition(hash)
    case 'numeric':
      return new NumericAttributeDefinition(hash)
    case 'selection':
      return new SelectionAttributeDefinition(hash)
    case 'string':
      return new StringAttributeDefinition(hash)
    default:
      throw new Error(
        `${hash['value type']} of ${JSON.stringify(hash)} is Uknown Attribute`
      )
  }
}
