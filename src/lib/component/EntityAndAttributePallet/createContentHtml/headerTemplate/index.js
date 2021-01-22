import getSelectedEntityLabel from './getSelectedEntityLabel'
import attributeTabTemplate from './attributeTabTemplate'

export default function (context) {
  const {
    isLock,
    selectionModelItems,
    selectedPred,
    attributes,
    hasDiff
  } = context

  const selectedEntityLabel = getSelectedEntityLabel(selectionModelItems.size)
  const addAttribute = attributes.length < 30
  const lastAttributeSelected =
    selectedPred === attributes[attributes.length - 1].pred

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
    .map((a, index, array) =>
      attributeTabTemplate(a, index, array, selectedPred)
    )
    .join('\n')}
  ${
    isLock
      ? ''
      : `
        ${
          lastAttributeSelected
            ? ''
            : '<span class="textae-editor__type-pallet__drop-target" data-index="-1"></span>'
        }
        ${
          addAttribute
            ? `
            <p class="textae-editor__type-pallet__attribute textae-editor__type-pallet__create-predicate">
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
