import getAttributeForSelecetdePred from './getAttributeForSelecetdePred'
import setShortcutKey from './setShortcutKey'

export default function (attributeContainer, selectedPred) {
  if (selectedPred) {
    return setShortcutKey(
      getAttributeForSelecetdePred(attributeContainer, selectedPred)
    )
  } else {
    return setShortcutKey(attributeContainer.attributes)
  }
}
