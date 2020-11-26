import getAttributeForSelecetdePred from './getAttributeForSelecetdePred'
import setShortcutKey from './setShortcutKey'
export default function (typeContainer, selectedPred) {
  let attributes
  if (selectedPred) {
    attributes = getAttributeForSelecetdePred(typeContainer, selectedPred)
  } else {
    attributes = typeContainer.attributes
  }
  return setShortcutKey(attributes)
}
