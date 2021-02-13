import editAttributeDefinitionBlockTemplate from '../editAttributeDefinitionBlockTemplate'
import addAttributeButtonTempalte from './addAttributeButtonTemplate'
import editAttributeButtonTemplate from './editAttributeButtonTemplate'
import removeAttributeButtonTemplate from './removeAttributeButtonTemplate'

export default function (context) {
  const { attrDef, selectionModelItems } = context
  const { pred } = attrDef
  const { valueType } = attrDef
  const numberOfSelectedItems = selectionModelItems.size

  return `
  <div class="textae-editor__type-pallet__predicate-controller">
    <div>
      ${editAttributeDefinitionBlockTemplate(context)}
      Attribute
      <span
        class="textae-editor__type-pallet__predicate__value-type textae-editor__type-pallet__predicate__value-type--${valueType}"
        title="${valueType} type">
      </span>
      "${pred}"
      ${
        numberOfSelectedItems > 0
          ? `
            ${addAttributeButtonTempalte(context)}
            ${editAttributeButtonTemplate(context)}
            ${removeAttributeButtonTemplate(context)}
            the ${numberOfSelectedItems} items selected
            `
          : ``
      }
    </div>
  </div>
  `
}
