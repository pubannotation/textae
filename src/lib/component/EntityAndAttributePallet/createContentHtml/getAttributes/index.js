import getAttributeForSelecetdePred from './getAttributeForSelecetdePred'

export default function (attributeContainer, selectedPred) {
  if (selectedPred) {
    return getAttributeForSelecetdePred(attributeContainer, selectedPred)
  } else {
    return attributeContainer.attributes
  }
}
