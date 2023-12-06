import headerTemplate from './headerTemplate'
import anemone from '../../anemone'

export default function (context) {
  const { types, isLock } = context

  return anemone`
  ${() => headerTemplate(context)}
  <table>
    <tbody>
      <tr>
        <th>id</th>
        <th>label</th>
        <th title="Number of annotations.">#</th>
        <th>
          ${() =>
            isLock
              ? ''
              : '<span class="textae-editor__pallet__add-button" title="Add new type"></span>'}
        </th>
      </tr>
      ${() =>
        types
          ? types
              .map(
                ({ color = '', id, uri, defaultType, label = '', useNumber }) =>
                  toTypeRow(
                    color,
                    id,
                    uri,
                    defaultType,
                    label,
                    useNumber,
                    isLock
                  )
              )
              .join('\n')
          : `
      <tr class="textae-editor__pallet__row">
        <td class="textae-editor__pallet__no-config" colspan="4">There is no Entity definition.</td>
      </tr>
      `}
    </tbody>
  </table>
  `
}
function toTypeRow(color, id, uri, defaultType, label, useNumber, isLock) {
  return anemone`
      <tr class="textae-editor__pallet__row" style="background-color: ${color};">
        <td class="textae-editor__pallet__label" data-id="${id}">
          <span title="${id}">
            ${id}
          </span>
          ${() =>
            uri
              ? anemone`<a href="${uri}" target="_blank"><span class="textae-editor__pallet__link"></span></a>`
              : ``}
          ${() =>
            defaultType
              ? '<span class="textae-editor__pallet__default-icon" title="This type is set as a default type."></span>'
              : ''}
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
          ${() =>
            isLock
              ? ''
              : `
          <button
            type="button"
            class="textae-editor__pallet__table-button textae-editor__pallet__edit-type"
            title="Edit this type." data-id="${id}"
            data-color="${color}"
            data-is-default="${defaultType}">
          </button>
          <button
            type="button"
            class="textae-editor__pallet__table-button textae-editor__pallet__remove${
              useNumber ? ' textae-editor__pallet__table-button--disabled' : ''
            }"
            title="${
              useNumber
                ? 'To activate this button, remove all the annotations of this type.'
                : 'Remove this type.'
            }"
            data-id="${id}"
            data-label="${label}">
          </button>
          `}
        </td>
      </tr>`
}
