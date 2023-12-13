import anemone from '../../../anemone'

export default function editButtonsTemplate(
  id,
  color,
  defaultType,
  label,
  useNumber
) {
  return () => anemone`
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
          `
}
