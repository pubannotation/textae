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
  const { attributes } = attributeContainer

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

  // When you re-read the configuration,
  // you may not find the attribute definition.
  if (!attrDef) {
    return typeTemplate({
      isLock,
      attributes,
      hasDiff,
      types,
      selectionModelItems
    })
  }

  const context = {
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
      return flagAttributeTemplate(context)
    case 'numeric':
      return numericAttributeTemplate(context)
    case 'selection':
      return selectionAttributeTemplate(context, attributeContainer)
    case 'string':
      return stringAttributeTemplate(context)
    default:
      throw `attrDef.valueType is unknown attribute`
  }
}
