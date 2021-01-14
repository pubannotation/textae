import headerTemplate from './headerTemplate'
import valueButtonsTemplate from './valueButtonsTemplate'
import showAddAttributeValueButton from './showAddAttributeValueButton'
import predicateControllerTemplate from './predicateControllerTemplate'

export default function (context) {
  const { pred, min, max, step, default: _default, values } = context.attrDef
  const { isLock } = context

  return `
  ${headerTemplate(context)}
  <div>
    <div class="textae-editor__type-pallet__predicate">
      ${predicateControllerTemplate(context)}
      min: ${min}
      max: ${max}
      step: ${step}
      default: ${_default}
    </div>

    <table>
      <tbody>
        <tr>
          <th>range</th>
          <th>label</th>
          <th>color</th>
          ${showAddAttributeValueButton(isLock)}
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
