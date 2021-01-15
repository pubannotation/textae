import getSelectedEntityLabel from './getSelectedEntityLabel'
import typeTemplate from './typeTemplate'
import flagAttributeTemplate from './flagAttributeTemplate'
import numericAttributeTemplate from './numericAttributeTemplate'
import selectionAttributeTemplate from './selectionAttributeTemplate'
import stringAttributeTemplate from './stringAttributeTemplate'
import getAttributes from './getAttributes'

export default function (
  types,
  hasDiff,
  selectedPred,
  selectionModelItems,
  attributeContainer,
  attributeInstances,
  isLock
) {
  const addAttribute = attributeContainer.attributes.length < 30
  const attributes = getAttributes(attributeContainer, selectedPred)

  if (!selectedPred) {
    return typeTemplate({
      isLock,
      attributes,
      hasDiff,
      types,
      addAttribute,
      selectedEntityLabel: getSelectedEntityLabel(selectionModelItems.size)
    })
  }

  const attrDef = attributeContainer.attributes.find(
    (a) => a.pred === selectedPred
  )

  const values = {
    isLock,
    attributes,
    hasDiff,
    attrDef: attrDef.JSON,
    selectedPred,
    lastAttributeSelected:
      attributeContainer.attributes.indexOf(attrDef) ===
      attributeContainer.attributes.length - 1,
    addAttribute,
    selectedEntityLabel: getSelectedEntityLabel(selectionModelItems.size),
    isEntityWithSamePredSelected: selectionModelItems.selectedWithAttributeOf(
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
