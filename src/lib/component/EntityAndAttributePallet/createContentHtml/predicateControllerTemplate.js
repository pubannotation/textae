import addOrEditAndRemoveAttributeButtonTemplate from './addOrEditAndRemoveAttributeButtonTemplate'
import editAttributeDefinitionBlockTemplate from './editAttributeDefinitionBlockTemplate'

export default function (context) {
  const { pred } = context.attrDef
  const valueType = context.attrDef['value type']

  return `
  <div class="textae-editor__type-pallet__predicate-controller">
    <div>
      ${editAttributeDefinitionBlockTemplate(context)}
      ${valueType} attribute: ${pred}
      ${
        valueType === 'string' || valueType === 'numeric'
          ? addOrEditAndRemoveAttributeButtonTemplate(context)
          : ''
      }
    </div>
  </div>
  `
}
