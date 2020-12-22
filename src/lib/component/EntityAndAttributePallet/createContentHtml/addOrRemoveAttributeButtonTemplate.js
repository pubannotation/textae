import { getAddAttributeButton } from './getAddAttributeButton'
import { getRemoveAttributeButton } from './getRemoveAttributeButton'

export function addOrRemoveAttributeButtonTemplate(
  isEntityWithSamePredSelected
) {
  return isEntityWithSamePredSelected
    ? getAddAttributeButton()
    : getRemoveAttributeButton()
}
