import editAttributeDefinitionBlockTemplate from '../editAttributeDefinitionBlockTemplate'
import getAddAttributeButton from './getAddAttributeButton'
import getEditAttributeButton from './getEditAttributeButton'
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
          ? `
            ${getAddAttributeButton(context)}
            ${getEditAttributeButton(context)}
            ${getRemoveAttributeButton(context)}
            `
          : ``
      }
    </div>
  </div>
  `
}
