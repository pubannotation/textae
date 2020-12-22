import headerTemplate from './headerTemplate'
import addOrRemoveAttributeButtonTemplate from './addOrRemoveAttributeButtonTemplate'
import { deleteAttributeDefinitionBlockTemplate } from './deleteAttributeDefinitionBlockTemplate'
import { valueButtonsTemplate } from './valueButtonsTemplate'

export default function (context) {
  const { pred, hasInstance, values } = context.attrDef
  const { isEntityWithSamePredSelected, isLock } = context

  return `
  ${headerTemplate(context)}
  <div>
    <div class="textae-editor__type-pallet__predicate">
      <div>
        selection attribute: ${pred}
        <button
          type="button"
          class="textae-editor__type-pallet__table-button textae-editor__type-pallet__edit-predicate"
          title="Edit this predicate.">
        </button>
        ${addOrRemoveAttributeButtonTemplate(isEntityWithSamePredSelected)}
      </div>
      ${deleteAttributeDefinitionBlockTemplate(hasInstance)}
    </div>

    <table>
      <tbody>
        <tr>
          <th>id</th>
          <th>label</th>
          <th>color</th>
          ${isLock ? '' : '<th></th>'}
        </tr>
        ${values
          .map(
            (
              { color = '', id, default: _default, label = '', indelible },
              index
            ) => {
              return `
        <tr class="textae-editor__type-pallet__row" style="background-color: ${color};">
          <td class="textae-editor__type-pallet__selection-attribute-label" data-id="${id}">
            ${id}
            ${
              _default
                ? '<span class="textae-editor__type-pallet__default-icon" title="This type is set as a default type."></span>'
                : ''
            }
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
            }
          )
          .join('\n')}
      </tbody>
    </table>
  </div>
  `
}
