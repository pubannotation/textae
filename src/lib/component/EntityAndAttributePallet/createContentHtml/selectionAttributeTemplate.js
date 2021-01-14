import headerTemplate from './headerTemplate'
import valueButtonsTemplate from './valueButtonsTemplate'
import showAddAttributeValueButton from './showAddAttributeValueButton'
import predicateControllerTemplate from './predicateControllerTemplate'

export default function (context) {
  const { pred, values } = context.attrDef
  const { isLock } = context

  return `
  ${headerTemplate(context)}
  <div>
    <div class="textae-editor__type-pallet__predicate">
      ${predicateControllerTemplate(context)}
    </div>

    <table>
      <tbody>
        <tr>
          <th>id</th>
          <th>label</th>
          <th>color</th>
          ${showAddAttributeValueButton(isLock)}
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
