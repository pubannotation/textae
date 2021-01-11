export default function (context) {
  const {
    isLock,
    selectedEntityLabel,
    selectedPred,
    attributes,
    addAttribute,
    lastAttributeSelected,
    addTypeButton,
    hasDiff
  } = context

  return `
<div style="display: flex;">
  <p class="textae-editor__type-pallet__title">
    <span>Entity configuration</span>
    <span class="textae-editor__type-pallet__lock-icon" style="display: ${
      isLock ? 'inline-block' : 'none'
    };">locked</span>
    <br>
    <span class="textae-editor__type-pallet__selected-entity-label">${selectedEntityLabel}</span>
  </p>
  <p class="textae-editor__type-pallet__attribute ${
    selectedPred ? '' : 'textae-editor__type-pallet__attribute--selected'
  }" data-attribute="">
    Type
  </p>
  ${attributes
    .map(({ droppable, selectedPred, pred, shortcutKey }, index) => {
      return `
    ${
      droppable
        ? `<span class="textae-editor__type-pallet__drop-target" data-index="${index}"></span>`
        : ''
    }
    <p 
      class="textae-editor__type-pallet__attribute${
        selectedPred ? ' textae-editor__type-pallet__attribute--selected' : ''
      }"
      data-attribute="${pred}"
      data-index="${index}"
      ${selectedPred ? 'draggable="true"' : ''}>
      ${shortcutKey ? `${shortcutKey}:` : ''}${pred}
    </p>
  `
    })
    .join('\n')}
  ${
    isLock
      ? ''
      : `${
          addAttribute
            ? `${
                lastAttributeSelected
                  ? ''
                  : '<span class="textae-editor__type-pallet__drop-target" data-index="-1"></span>'
              }    <p class="textae-editor__type-pallet__attribute textae-editor__type-pallet__create-predicate">
  <span class="textae-editor__type-pallet__create-predicate__button" title="Add new attribute"></span>
</p>
`
            : ''
        }`
  }
  <div class="textae-editor__type-pallet__buttons">
  ${
    isLock
      ? ''
      : `${
          addTypeButton
            ? '<span class="textae-editor__type-pallet__button textae-editor__type-pallet__add-button" title="Add new type"></span>'
            : ''
        }
      `
  }
    <span class="textae-editor__type-pallet__button textae-editor__type-pallet__read-button" title="Import"></span>
    <span class="textae-editor__type-pallet__button textae-editor__type-pallet__write-button ${
      hasDiff ? 'textae-editor__type-pallet__write-button--transit' : ''
    }" title="Upload"></span>
  </div>
</div>
`
}
