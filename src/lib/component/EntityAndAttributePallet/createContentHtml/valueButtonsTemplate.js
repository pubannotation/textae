export function valueButtonsTemplate(isLock, index, indelible) {
  return isLock
    ? ''
    : `
  <td class="textae-editor__type-pallet__table-attribute-buttons">
    <button
      type="button"
      class="textae-editor__type-pallet__table-button textae-editor__type-pallet__edit-value"
      title="Edit this value." data-index="${index}">
    </button>
    <button 
      type="button"
      class="textae-editor__type-pallet__table-button textae-editor__type-pallet__remove-value${
        indelible ? ' textae-editor__type-pallet__table-button--disabled' : ''
      }"
      title="${
        indelible
          ? 'To activate this button, remove all the annotations of this type.'
          : 'Remove this value.'
      }"
      ${indelible ? ' disabled="disabled"' : ''}
      data-index="${index}">
    </button>
  </td>
  `
}
