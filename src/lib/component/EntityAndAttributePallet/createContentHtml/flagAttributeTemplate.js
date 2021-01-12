import headerTemplate from './headerTemplate'
import addOrRemoveAttributeButtonTemplate from './addOrRemoveAttributeButtonTemplate'
import deleteAttributeDefinitionBlockTemplate from './deleteAttributeDefinitionBlockTemplate'

export default function (context) {
  const { pred, hasInstance } = context.attrDef
  const { isEntityWithSamePredSelected } = context

  return `
  ${headerTemplate(context)}
  <div>
    <div class="textae-editor__type-pallet__predicate">
      <div class="textae-editor__type-pallet__predicate-controller">
        <div>
          ${deleteAttributeDefinitionBlockTemplate(hasInstance)}
          flag attribute: ${pred}
          ${addOrRemoveAttributeButtonTemplate(isEntityWithSamePredSelected)}
        </div>
      </div>
    </div>
  </div>
  `
}
