import FlagAttributeDefinition from './FlagAttributeDefinition'
import NumericAttributeDefinition from './NumericAttributeDefinition'
import SelectionAttributeDefinition from './SelectionAttributeDefinition'
import StringAttributeDefinition from './StringAttributeDefinition'

export default function(hash) {
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
      throw `hash['value type'] is Uknown Attribute`
  }
}
