import { headerTemplate } from './headerTemplate'
import { addOrEditAndRemoveAttributeButtonTemplate } from './addOrEditAndRemoveAttributeButtonTemplate'
import { deleteAttributeDefinitionBlockTemplate } from './deleteAttributeDefinitionBlockTemplate'
import { valueButtonsTemplate } from './valueButtonsTemplate'

export default function (context) {
  const {
    pred,
    hasInstance,
    min,
    max,
    step,
    default: _default,
    values
  } = context.attrDef
  const { isEntityWithSamePredSelected, isLock } = context

  return `
  ${headerTemplate(context)}
  <div>
    <div class="textae-editor__type-pallet__predicate">
      <div>
        <div>
          numeric attribute: ${pred}
          <button
            type="button"
            class="textae-editor__type-pallet__table-button textae-editor__type-pallet__edit-predicate"
            title="Edit this predicate.">
          </button>
          ${addOrEditAndRemoveAttributeButtonTemplate(
            isEntityWithSamePredSelected
          )}
        </div>
        min: ${min}
        max: ${max}
        step: ${step}
        default: ${_default}
      </div>
      ${deleteAttributeDefinitionBlockTemplate(hasInstance)}
    </div>

    <table>
      <tbody>
        <tr>
          <th>range</th>
          <th>label</th>
          <th>color</th>
          ${isLock ? '' : '<th></th>'}
        </tr>
        ${values
          .map(({ color = '', range, label = '', indelible }, index) => {
            return `
        <tr class="textae-editor__type-pallet__row" style="background-color: ${color};">
          <td class="textae-editor__type-pallet__attribute-label">
            ${range}
          </td>
          <td class="textae-editor__type-pallet__short-label">
            ${label}
          </td>
          <td class="textae-editor__type-pallet__short-label">
            ${color}
          </td>
          ${valueButtonsTemplate(isLock, index, indelible)}
        </tr>
      `
          })
          .join('\n')}
      </tbody>
    </table>
  </div>
  `
}
