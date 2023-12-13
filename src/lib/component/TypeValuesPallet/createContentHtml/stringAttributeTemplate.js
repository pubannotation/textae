import headerTemplate from './headerTemplate'
import valueButtonsTemplate from './valueButtonsTemplate'
import showAddAttributeValueButton from './showAddAttributeValueButton'
import predicateControllerTemplate from './predicateControllerTemplate'
import anemone from '../../anemone'

export default function (context) {
  const { default: defaultValue, mediaHeight, values } = context.attrDef
  const { isLock } = context

  return anemone`
  ${headerTemplate(context)}
  <div>
    <div class="textae-editor__pallet__predicate">
      ${predicateControllerTemplate(context)}
      media height: ${mediaHeight || '""'}
      default: ${defaultValue}
    </div>

    <table>
      <tbody>
        <tr>
          <th>pattern</th>
          <th>label</th>
          <th>color</th>
          ${showAddAttributeValueButton(isLock)}
        </tr>
        ${() =>
          values.map(
            ({ color = ' ', pattern = '', label = '', indelible }, index) => {
              return anemone`
        <tr class="textae-editor__pallet__row" style="background-color: ${color};">
          <td class="textae-editor__pallet__attribute-label">
            ${pattern}
          </td>
          <td class="textae-editor__pallet__short-label">
            ${label}
          </td>
          <td class="textae-editor__pallet__short-label">
            ${color}
          </td>
          ${() => valueButtonsTemplate(isLock, index, indelible)}
        </tr>`
            }
          )}
      </tbody>
    </table>
  </div>
  `
}
