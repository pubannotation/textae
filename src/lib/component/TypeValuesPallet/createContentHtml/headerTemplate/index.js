import getSelectedEntityLabel from './getSelectedEntityLabel'
import attributeTabTemplate from './attributeTabTemplate'
import addAttributeButtonTemplate from './addAttributeButtonTemplate'
import editAttributeButtonTemplate from './editAttributeButtonTemplate'
import removeAttributeButtonTemplate from './removeAttributeButtonTemplate'
import anemone from '../../../anemone'
import addNewAttributeTabTemplate from './addNewAttributeTabTemplate'

export default function (context) {
  const { isLock, selectionModelItems, selectedPred, attributes, hasDiff } =
    context

  const selectedEntityLabel = getSelectedEntityLabel(selectionModelItems.size)
  const isEnableToAddAttribute = attributes.length < 30
  const lastAttributeSelected =
    selectedPred ===
    (attributes[attributes.length - 1] &&
      attributes[attributes.length - 1].pred)

  return () => anemone`
<div class="textae-editor__pallet__header-first-row">
  <div class="textae-editor__pallet__information">
    <span class="textae-editor__pallet__lock-icon" style="display: ${
      isLock ? 'inline-block' : 'none'
    };">locked</span>
    ${
      selectedPred && selectionModelItems.size > 0
        ? () => anemone`
          ${addAttributeButtonTemplate(context)}
          ${editAttributeButtonTemplate(context)}
          ${removeAttributeButtonTemplate(context)}
          the
          `
        : ``
    }
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
  ${attributes.map((a, index, array) =>
    attributeTabTemplate(a, index, array, selectedPred)
  )}
  ${addNewAttributeTabTemplate(
    isLock,
    lastAttributeSelected,
    isEnableToAddAttribute
  )}
</div>
`
}
