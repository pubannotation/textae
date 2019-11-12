import AttributeDefinition from './AttributeDefinition'
import FlagAttributeDefinition from './FlagAttributeDefinition'
import SelectionAttributeDefinition from './SelectionAttributeDefinition'

export default function(hash) {
  switch (hash['value type']) {
    case 'flag':
      return new FlagAttributeDefinition(hash)
    case 'selection':
      return new SelectionAttributeDefinition(hash)
    default:
      return new AttributeDefinition()
  }
}
