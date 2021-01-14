import getAddAttributeButton from './getAddAttributeButton'
import getRemoveAttributeButton from './getRemoveAttributeButton'

export default function (context) {
  const { isEntityWithSamePredSelected } = context

  return isEntityWithSamePredSelected
    ? getRemoveAttributeButton()
    : getAddAttributeButton()
}
