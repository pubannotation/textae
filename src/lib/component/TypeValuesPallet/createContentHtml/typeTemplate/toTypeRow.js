import anemone from '../../../anemone'
import editButtonsTemplate from './editButtonsTemplate'

export default function toTypeRow(
  color,
  id,
  uri,
  defaultType,
  label,
  useNumber,
  isLock
) {
  return () => anemone`
      <tr class="textae-editor__pallet__row" style="background-color: ${color};">
        <td class="textae-editor__pallet__label" data-id="${id}">
          <span title="${id}">
            ${id}
          </span>
          ${
            uri
              ? () =>
                  anemone`<a href="${uri}" target="_blank"><span class="textae-editor__pallet__link"></span></a>`
              : ``
          }
          ${
            defaultType
              ? () =>
                  '<span class="textae-editor__pallet__default-icon" title="This type is set as a default type."></span>'
              : ''
          }
        </td>
        <td class="textae-editor__pallet__short-label">
          ${label}
        </td>
        <td class="textae-editor__pallet__use-number">
          ${useNumber}
        </td>
        <td class="textae-editor__pallet__table-buttons">
          <button
            type="button"
            class="textae-editor__pallet__table-button textae-editor__pallet__select-all${
              useNumber ? '' : ' textae-editor__pallet__table-button--disabled'
            }"
            title="Select all the cases of this type."
            data-id="${id}"
            data-use-number="${useNumber}">
          </button>
          ${
            isLock
              ? ''
              : editButtonsTemplate(id, color, defaultType, label, useNumber)
          }
        </td>
      </tr>`
}
