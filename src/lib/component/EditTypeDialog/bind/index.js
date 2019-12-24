import observeEnterKeyPress from './observeEnterKeyPress'
import observeAddAttributeButton from './observeAddAttributeButton'
import observeRemoveAttributeButton from './observeRemoveAttributeButton'
import observeDuplicatedPredicateValidation from './observeDuplicatedPredicateValidation'

export default function(element, onOk) {
  observeAddAttributeButton(element)
  observeRemoveAttributeButton(element)
  observeDuplicatedPredicateValidation(element)
  observeEnterKeyPress(element, onOk)
}
