import getAddAttributeButton from './getAddAttributeButton'
import getRemoveAttributeButton from './getRemoveAttributeButton'

export default function (context) {
  const { isEntityWithSamePredSelected } = context

  return isEntityWithSamePredSelected
    ? `
  <button
    type="button"
    class="textae-editor__type-pallet__edit-object"
    >edit object of</button>
  ${getRemoveAttributeButton()}
  `
    : getAddAttributeButton()
}
