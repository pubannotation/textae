import headerTemplate from './headerTemplate'
import addOrEditAndRemoveAttributeButtonTemplate from './addOrEditAndRemoveAttributeButtonTemplate'
import editAttributeDefinitionBlockTemplate from './editAttributeDefinitionBlockTemplate'
import valueButtonsTemplate from './valueButtonsTemplate'
import showAddAttributeValueButton from './showAddAttributeValueButton'

export default function (context) {
  const { pred, default: _default, values } = context.attrDef
  const { isEntityWithSamePredSelected, isLock } = context

  return `
  ${headerTemplate(context)}
  <div>
    <div class="textae-editor__type-pallet__predicate">
      <div class="textae-editor__type-pallet__predicate-controller">
        <div>
          ${editAttributeDefinitionBlockTemplate(context)}
          string attribute: ${pred}
          ${addOrEditAndRemoveAttributeButtonTemplate(
            isEntityWithSamePredSelected
          )}
        </div>
      </div>
      default: ${_default}
    </div>

    <table>
      <tbody>
        <tr>
          <th>pattern</th>
          <th>label</th>
          <th>color</th>
          ${showAddAttributeValueButton(isLock)}
        </tr>
        ${values
          .map(({ color, pattern = '', label = '', indelible }, index) => {
            return `
        <tr class="textae-editor__type-pallet__row" style="background-color: ${color};">
          <td class="textae-editor__type-pallet__attribute-label">
            ${pattern}
          </td>
          <td class="textae-editor__type-pallet__short-label">
            ${label}
          </td>
          <td class="textae-editor__type-pallet__short-label">
            ${color}
          </td>
          ${valueButtonsTemplate(isLock, index, indelible)}
        </tr>`
          })
          .join('\n')}
      </tbody>
    </table>
  </div>
  `
}
