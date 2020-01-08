import AttributeDefinition from './AttributeDefinition'
import FlagAttributeDefinition from './FlagAttributeDefinition'
import SelectionAttributeDefinition from './SelectionAttributeDefinition'
import StringAttributeDefinition from './StringAttributeDefinition'

export default function(hash) {
  switch (hash['value type']) {
    case 'flag':
      return new FlagAttributeDefinition(hash)
    case 'selection':
      return new SelectionAttributeDefinition(hash)
    case 'string':
      return new StringAttributeDefinition(hash)
    default:
      return new AttributeDefinition()
  }
}
