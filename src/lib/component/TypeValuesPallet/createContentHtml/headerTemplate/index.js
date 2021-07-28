import getSelectedEntityLabel from './getSelectedEntityLabel'
import attributeTabTemplate from './attributeTabTemplate'
import addAttributeButtonTempalte from './addAttributeButtonTemplate'
import editAttributeButtonTemplate from './editAttributeButtonTemplate'
import removeAttributeButtonTemplate from './removeAttributeButtonTemplate'

export default function (context) {
  const { isLock, selectionModelItems, selectedPred, attributes, hasDiff } =
    context

  const selectedEntityLabel = getSelectedEntityLabel(selectionModelItems.size)
  const addAttribute = attributes.length < 30
  const lastAttributeSelected =
    selectedPred ===
    (attributes[attributes.length - 1] &&
      attributes[attributes.length - 1].pred)

  return `
<div class="textae-editor__type-pallet__header-first-row" style="display: flex; justify-content: space-between;">
  <div class="textae-editor__type-pallet__information">
    <span class="textae-editor__type-pallet__lock-icon" style="display: ${
      isLock ? 'inline-block' : 'none'
    };">locked</span>
    ${
      selectedPred && selectionModelItems.size > 0
        ? `
          ${addAttributeButtonTempalte(context)}
          ${editAttributeButtonTemplate(context)}
          ${removeAttributeButtonTemplate(context)}
          the
          `
        : ``
    }
    <span class="textae-editor__type-pallet__selected-entity-label">${selectedEntityLabel}</span>
  </div>
  <div class="textae-editor__type-pallet__buttons">
    <span class="textae-editor__type-pallet__button textae-editor__type-pallet__read-button" title="Import"></span>
    <span class="textae-editor__type-pallet__button textae-editor__type-pallet__write-button ${
      hasDiff ? 'textae-editor__type-pallet__write-button--transit' : ''
    }" title="Upload"></span>
  </div>
</div>
<div class="textae-editor__type-pallet__header-second-row" style="display: flex;">
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
              <span class="textae-editor__type-pallet__create-predicate__button" title="Add a new attribute"></span>
            </p>
            `
            : ''
        }`
  }
</div>
`
}
