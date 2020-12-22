import getAddAttributeButton from './getAddAttributeButton'
import getRemoveAttributeButton from './getRemoveAttributeButton'

export default function (isEntityWithSamePredSelected) {
  return isEntityWithSamePredSelected
    ? getAddAttributeButton()
    : getRemoveAttributeButton()
}
