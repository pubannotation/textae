export default function (isLock) {
  return ({ color, id, uri, defaultType, label, useNumber }) => `
<tr class="textae-editor__type-pallet__row" style="background-color: ${color};">
  <td class="textae-editor__type-pallet__label" data-id="${id}">
    <span title=${id}>
      ${id}
    </span>
    ${
      uri
        ? `
    <a 
      href="${uri}" 
      target="_blank">
      <span class="textae-editor__type-pallet__link"></span>
    </a>
    `
        : ``
    }
    ${
      defaultType
        ? `
    <span 
      class="textae-editor__type-pallet__default-icon" 
      title="This type is set as a default type."></span>
    `
        : ``
    }
  </td>
  <td class="textae-editor__type-pallet__short-label">
    ${label || ''}
  </td>
  <td class="textae-editor__type-pallet__use-number">
    ${useNumber ? useNumber : `0`}
  </td>
  <td class="textae-editor__type-pallet__table-buttons">
    <button
      type="button"
      class="textae-editor__type-pallet__table-button textae-editor__type-pallet__select-all ${
        useNumber ? `` : `textae-editor__type-pallet__table-button--disabled`
      }"
      title="Select all the cases of this type."
      data-id="${id}"
      data-use-number="${useNumber}">
    </button>
    ${
      isLock
        ? ``
        : `
    <button
      type="button"
      class="textae-editor__type-pallet__table-button textae-editor__type-pallet__edit-type"
      title="Edit this type." data-id="${id}"
      data-color="${color}"
      data-is-default="${defaultType}">
    </button>
    <button 
      type="button"
      class="textae-editor__type-pallet__table-button textae-editor__type-pallet__remove ${
        useNumber ? `textae-editor__type-pallet__table-button--disabled` : ``
      }"
      title="${
        useNumber
          ? `To activate this button, remove all the annotations of this type.`
          : `Remove this type.`
      }"
      data-id="${id}"
      data-label="${label}">
    </button>
    `
    }
  </td>
</tr>
`
}
