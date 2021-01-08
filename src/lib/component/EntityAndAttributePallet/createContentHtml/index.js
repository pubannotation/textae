import getSelectedEntityLabel from './getSelectedEntityLabel'
import getAttributes from './getAttributes'
import typeTemplate from './typeTemplate'
import flagAttributeTemplate from './flagAttributeTemplate'
import numericAttributeTemplate from './numericAttributeTemplate'
import selectionAttributeTemplate from './selectionAttributeTemplate'
import stringAttributeTemplate from './stringAttributeTemplate'

export default function (
  typeContainer,
  hasDiff,
  selectedPred,
  selectionModelEntity
) {
  const addAttribute = typeContainer.attributes.length < 30
  const attributes = getAttributes(typeContainer, selectedPred)

  if (!selectedPred) {
    return typeTemplate({
      isLock: typeContainer.isLock,
      attributes,
      hasDiff,
      types: typeContainer.pallet,
      addAttribute,
      addTypeButton: true,
      selectedEntityLabel: getSelectedEntityLabel(selectionModelEntity.size)
    })
  }

  const attrDef = typeContainer.attributes.find((a) => a.pred === selectedPred)

  const values = {
    isLock: typeContainer.isLock,
    attributes,
    hasDiff,
    attrDef: Object.assign(attrDef.JSON, {
      hasInstance: typeContainer.hasAttributeInstance(selectedPred)
    }),
    selectedPred,
    lastAttributeSelected:
      typeContainer.attributes.indexOf(attrDef) ===
      typeContainer.attributes.length - 1,
    addAttribute,
    selectedEntityLabel: getSelectedEntityLabel(selectionModelEntity.size),
    isEntityWithSamePredSelected: selectionModelEntity.isSamePredAttrributeSelected(
      selectedPred
    )
  }

  switch (attrDef.valueType) {
    case 'flag':
      return flagAttributeTemplate(values)
    case 'numeric':
      return numericAttributeTemplate(
        Object.assign(values, {
          addAttributeValueButton: true
        })
      )
    case 'selection':
      // Disable to press the remove button for the value used in the selection attribute.
      for (const value of values.attrDef.values) {
        value.indelible = typeContainer.isSelectionAttributeIndelible(
          selectedPred,
          value.id
        )
      }

      return selectionAttributeTemplate(
        Object.assign(values, {
          addAttributeValueButton: true
        })
      )
    case 'string':
      return stringAttributeTemplate(
        Object.assign(values, {
          addAttributeValueButton: true
        })
      )
    default:
      throw `attrDef.valueType is unknown attribute`
  }
}
