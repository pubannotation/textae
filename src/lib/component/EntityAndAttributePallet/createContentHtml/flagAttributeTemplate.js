import headerTemplate from './headerTemplate'
import addOrRemoveAttributeButtonTemplate from './addOrRemoveAttributeButtonTemplate'
import editAttributeDefinitionBlockTemplate from './editAttributeDefinitionBlockTemplate'

export default function (context) {
  const { pred } = context.attrDef
  const { isEntityWithSamePredSelected } = context

  return `
  ${headerTemplate(context)}
  <div>
    <div class="textae-editor__type-pallet__predicate">
      <div class="textae-editor__type-pallet__predicate-controller">
        <div>
          ${editAttributeDefinitionBlockTemplate(context)}
          flag attribute: ${pred}
          ${addOrRemoveAttributeButtonTemplate(context)}
        </div>
      </div>
    </div>
  </div>
  `
}
