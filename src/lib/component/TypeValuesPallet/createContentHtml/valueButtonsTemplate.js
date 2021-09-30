export default function (isLock, index, indelible) {
  return isLock
    ? ''
    : `
  <td class="textae-editor__pallet__table-attribute-buttons">
    <button
      type="button"
      class="textae-editor__pallet__table-button textae-editor__pallet__edit-value"
      title="Edit this value." data-index="${index}">
    </button>
    <button 
      type="button"
      class="textae-editor__pallet__table-button textae-editor__pallet__remove-value${
        indelible ? ' textae-editor__pallet__table-button--disabled' : ''
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
