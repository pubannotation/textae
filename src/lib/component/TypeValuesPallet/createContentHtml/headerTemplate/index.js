import getSelectedEntityLabel from './getSelectedEntityLabel'
import attributeTabTemplate from './attributeTabTemplate'
import addAttributeButtonTemplate from './addAttributeButtonTemplate'
import editAttributeButtonTemplate from './editAttributeButtonTemplate'
import removeAttributeButtonTemplate from './removeAttributeButtonTemplate'
import anemone from '../../../anemone'

export default function (context) {
  const { isLock, selectionModelItems, selectedPred, attributes, hasDiff } =
    context

  const selectedEntityLabel = getSelectedEntityLabel(selectionModelItems.size)
  const addAttribute = attributes.length < 30
  const lastAttributeSelected =
    selectedPred ===
    (attributes[attributes.length - 1] &&
      attributes[attributes.length - 1].pred)

  return anemone`
<div class="textae-editor__pallet__header-first-row">
  <div class="textae-editor__pallet__information">
    <span class="textae-editor__pallet__lock-icon" style="display: ${
      isLock ? 'inline-block' : 'none'
    };">locked</span>
    ${() =>
      selectedPred && selectionModelItems.size > 0
        ? `
          ${addAttributeButtonTemplate(context)}
          ${editAttributeButtonTemplate(context)}
          ${removeAttributeButtonTemplate(context)}
          the
          `
        : ``}
    <span class="textae-editor__pallet__selected-entity-label">${selectedEntityLabel}</span>
  </div>
  <div class="textae-editor__pallet__buttons">
    <span class="textae-editor__pallet__button textae-editor__pallet__import-button" title="Import"></span>
    <span class="textae-editor__pallet__button textae-editor__pallet__upload-button ${
      hasDiff ? 'textae-editor__pallet__upload-button--transit' : ''
    }" title="Upload"></span>
  </div>
</div>
<div class="textae-editor__pallet__header-second-row">
  <p class="textae-editor__pallet__attribute ${
    selectedPred ? '' : 'textae-editor__pallet__attribute--selected'
  }" data-attribute="">
    Type
  </p>
  ${() =>
    attributes.map((a, index, array) =>
      attributeTabTemplate(a, index, array, selectedPred)
    )}
  ${() =>
    isLock
      ? ''
      : `
        ${
          lastAttributeSelected
            ? ''
            : '<span class="textae-editor__pallet__drop-target" data-index="-1"></span>'
        }
        ${
          addAttribute
            ? `
            <p class="textae-editor__pallet__attribute textae-editor__pallet__create-predicate">
              <span class="textae-editor__pallet__create-predicate__button" title="Add a new attribute"></span>
            </p>
            `
            : ''
        }`}
</div>
`
}
