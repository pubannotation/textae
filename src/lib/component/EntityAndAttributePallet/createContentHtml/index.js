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
    attrDef: attrDef.JSON,
    selectedPred,
    selectionModelItems,
    isEntityWithSamePredSelected: selectionModelItems.selectedWithAttributeOf(
      selectedPred
    ),
    isEntityWithoutSamePredSelected: selectionModelItems.selectedWithoutAttributeOf(
      selectedPred
    ),
    isOnlyEntityWithJsutOneSamePredSelected: selectionModelItems.onlySelectedWithJustOneAttributeOf(
      selectedPred
    ),
    numberOfItemsUsingSelectedPred: new Set(
      attributeInstances
        .filter((a) => a.pred === selectedPred)
        .map((a) => a.subj)
    ),
    numberOfSelectedItems: selectionModelItems.size
  }

  switch (attrDef.valueType) {
    case 'flag':
      return flagAttributeTemplate(values)
    case 'numeric':
      return numericAttributeTemplate(values)
    case 'selection':
      // Disable to press the remove button for the value used in the selection attribute.
      for (const value of values.attrDef.values) {
        value.indelible = attributeContainer.isSelectionAttributeValueIndelible(
          selectedPred,
          value.id
        )
      }

      return selectionAttributeTemplate(values)
    case 'string':
      return stringAttributeTemplate(values)
    default:
      throw `attrDef.valueType is unknown attribute`
  }
}
