import addOrEditAndRemoveAttributeButtonTemplate from './addOrEditAndRemoveAttributeButtonTemplate'
import addOrRemoveAttributeButtonTemplate from './addOrRemoveAttributeButtonTemplate'
import editAttributeDefinitionBlockTemplate from './editAttributeDefinitionBlockTemplate'

export default function (context) {
  const { attrDef, numberOfSelectedItems } = context
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
                ? addOrEditAndRemoveAttributeButtonTemplate(context)
                : addOrRemoveAttributeButtonTemplate(context)
            }
            the ${numberOfSelectedItems} items selected
            `
          : ``
      }
    </div>
  </div>
  `
}
