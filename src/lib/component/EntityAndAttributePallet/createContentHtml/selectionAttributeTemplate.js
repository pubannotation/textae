import headerTemplate from './headerTemplate'
import valueButtonsTemplate from './valueButtonsTemplate'
import showAddAttributeValueButton from './showAddAttributeValueButton'
import predicateControllerTemplate from './predicateControllerTemplate'

export default function (context, attributeContainer) {
  const { values } = context.attrDef
  const { isLock, selectedPred } = context

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
            ({ color = '', id, default: defaultValue, label = '' }, index) => {
              return `
        <tr class="textae-editor__type-pallet__row" style="background-color: ${color};">
          <td class="textae-editor__type-pallet__selection-attribute-label" data-id="${id}">
            ${id}
            ${
              defaultValue
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
          ${valueButtonsTemplate(
            isLock,
            index,
            attributeContainer.isSelectionAttributeValueIndelible(
              // Disable to press the remove button for the value used in the selection attribute.
              selectedPred,
              id
            )
          )}
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
