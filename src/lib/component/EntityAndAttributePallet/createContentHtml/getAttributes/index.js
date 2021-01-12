import getAttributeForSelecetdePred from './getAttributeForSelecetdePred'
import setShortcutKey from './setShortcutKey'
export default function (entityContainer, selectedPred) {
  let attributes
  if (selectedPred) {
    attributes = getAttributeForSelecetdePred(entityContainer, selectedPred)
  } else {
    attributes = entityContainer.attributes
  }
  return setShortcutKey(attributes)
}
