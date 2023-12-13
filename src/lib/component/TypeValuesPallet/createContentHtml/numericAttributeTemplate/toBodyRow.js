import valueButtonsTemplate from '../valueButtonsTemplate'
import anemone from '../../../anemone'

export default function toBodyRow(
  color,
  range,
  label,
  isLock,
  index,
  indelible
) {
  return () => anemone`
    <tr class="textae-editor__pallet__row" style="background-color: ${color};">
      <td class="textae-editor__pallet__attribute-label">
        ${range}
      </td>
      <td class="textae-editor__pallet__short-label">
        ${label}
      </td>
      <td class="textae-editor__pallet__short-label">
        ${color}
      </td>
      ${valueButtonsTemplate(isLock, index, indelible)}
    </tr>
  `
}
