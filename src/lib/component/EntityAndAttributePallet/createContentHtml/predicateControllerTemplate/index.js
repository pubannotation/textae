import editAttributeDefinitionBlockTemplate from '../editAttributeDefinitionBlockTemplate'
import addAttributeButtonTempalte from './addAttributeButtonTemplate'
import editAttributeButtonTemplate from './editAttributeButtonTemplate'
import removeAttributeButtonTemplate from './removeAttributeButtonTemplate'

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
          ? `
            ${addAttributeButtonTempalte(context)}
            ${editAttributeButtonTemplate(context)}
            ${removeAttributeButtonTemplate(context)}
            `
          : ``
      }
    </div>
  </div>
  `
}
