import getAttributeForSelecetdePred from './getAttributeForSelecetdePred'
import setShortcutKey from './setShortcutKey'

export default function (attributeContainer, selectedPred) {
  let attributes

  if (selectedPred) {
    attributes = getAttributeForSelecetdePred(attributeContainer, selectedPred)
  } else {
    attributes = attributeContainer.attributes
  }

  return setShortcutKey(attributes)
}
