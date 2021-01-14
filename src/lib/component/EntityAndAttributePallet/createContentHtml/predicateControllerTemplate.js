import addOrEditAndRemoveAttributeButtonTemplate from './addOrEditAndRemoveAttributeButtonTemplate'
import addOrRemoveAttributeButtonTemplate from './addOrRemoveAttributeButtonTemplate'
import editAttributeDefinitionBlockTemplate from './editAttributeDefinitionBlockTemplate'

export default function (context) {
  const { pred } = context.attrDef
  const valueType = context.attrDef['value type']

  return `
  <div class="textae-editor__type-pallet__predicate-controller">
    <div>
      ${editAttributeDefinitionBlockTemplate(context)}
      Attribute "${pred}" (${valueType} type) 
      ${
        valueType === 'string' || valueType === 'numeric'
          ? addOrEditAndRemoveAttributeButtonTemplate(context)
          : addOrRemoveAttributeButtonTemplate(context)
      }
    </div>
  </div>
  `
}
