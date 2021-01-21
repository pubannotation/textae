import toAttributeTab from './toAttributeTab'

export default function (context) {
  const {
    isLock,
    selectedEntityLabel,
    selectedPred,
    attributes,
    addAttribute,
    lastAttributeSelected,
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
  ${attributes.map((a, index) => toAttributeTab(a, index)).join('\n')}
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
    <span class="textae-editor__type-pallet__button textae-editor__type-pallet__read-button" title="Import"></span>
    <span class="textae-editor__type-pallet__button textae-editor__type-pallet__write-button ${
      hasDiff ? 'textae-editor__type-pallet__write-button--transit' : ''
    }" title="Upload"></span>
  </div>
</div>
`
}
