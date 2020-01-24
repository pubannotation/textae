import observeAddAttributeButton from './observeAddAttributeButton'
import observeRemoveAttributeButton from './observeRemoveAttributeButton'
import observeDuplicatedPredicateValidation from './observeDuplicatedPredicateValidation'

export default function(element) {
  observeAddAttributeButton(element)
  observeRemoveAttributeButton(element)
  observeDuplicatedPredicateValidation(element)
}
