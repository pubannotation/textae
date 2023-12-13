import anemone from '../anemone'

export default function toBodyRow(color, id, defaultValue, label) {
  return () => anemone`
        <tr class="textae-editor__pallet__row" style="background-color: ${color};">
          <td class="textae-editor__pallet__selection-attribute-label" data-id="${id}">
            ${id}
            ${() =>
              defaultValue
                ? '<span class="textae-editor__pallet__default-icon" title="This type is set as a default type."></span>'
                : ''}
          </td>
          <td class="textae-editor__pallet__short-label">
            ${label}
          </td>
          <td class="textae-editor__pallet__short-label">
            ${color}
          </td>
        </tr>
        `
}
