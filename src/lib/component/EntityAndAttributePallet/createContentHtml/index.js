import typeTemplate from './typeTemplate'
import flagAttributeTemplate from './flagAttributeTemplate'
import numericAttributeTemplate from './numericAttributeTemplate'
import selectionAttributeTemplate from './selectionAttributeTemplate'
import stringAttributeTemplate from './stringAttributeTemplate'

export default function (
  types,
  hasDiff,
  selectedPred,
  selectionModelItems,
  attributeContainer,
  attributeInstances,
  isLock
) {
  const attributes = attributeContainer.attributes

  if (!selectedPred) {
    return typeTemplate({
      isLock,
      attributes,
      hasDiff,
      types,
      selectionModelItems
    })
  }

  const attrDef = attributes.find((a) => a.pred === selectedPred)

  const values = {
    isLock,
    attributes,
    hasDiff,
    attrDef,
    selectedPred,
    selectionModelItems,
    numberOfItemsUsingSelectedPred: new Set(
      attributeInstances
        .filter((a) => a.pred === selectedPred)
        .map((a) => a.subj)
    )
  }

  switch (attrDef.valueType) {
    case 'flag':
      return flagAttributeTemplate(values)
    case 'numeric':
      return numericAttributeTemplate(values)
    case 'selection':
      return selectionAttributeTemplate(values, attributeContainer)
    case 'string':
      return stringAttributeTemplate(values)
    default:
      throw `attrDef.valueType is unknown attribute`
  }
}
