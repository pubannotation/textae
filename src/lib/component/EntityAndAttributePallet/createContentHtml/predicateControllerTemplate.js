import editAttributeDefinitionBlockTemplate from './editAttributeDefinitionBlockTemplate'
import getAddAttributeButton from './getAddAttributeButton'
import getRemoveAttributeButton from './getRemoveAttributeButton'

export default function (context) {
  const {
    attrDef,
    numberOfSelectedItems,
    isEntityWithSamePredSelected
  } = context
  const { pred } = attrDef
  const valueType = attrDef['value type']

  return `
  <div class="textae-editor__type-pallet__predicate-controller">
    <div>
      ${editAttributeDefinitionBlockTemplate(context)}
      Attribute "${pred}" (
        <span
          class="textae-editor__type-pallet__predicate__value-type textae-editor__type-pallet__predicate__value-type--${valueType}"
          title="${valueType} type">
          type
        </span>
      ) 
      ${
        numberOfSelectedItems > 0
          ? `${
              valueType === 'string' || valueType === 'numeric'
                ? isEntityWithSamePredSelected
                  ? `
                <button
                  type="button"
                  class="textae-editor__type-pallet__edit-object"
                  >edit object of</button>
                ${getRemoveAttributeButton()}
                `
                  : getAddAttributeButton()
                : isEntityWithSamePredSelected
                ? getRemoveAttributeButton()
                : getAddAttributeButton()
            }
            the ${numberOfSelectedItems} items selected
            `
          : ``
      }
    </div>
  </div>
  `
}
