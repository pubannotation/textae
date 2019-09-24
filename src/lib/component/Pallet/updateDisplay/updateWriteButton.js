import { diff } from 'jsondiffpatch'
import CLASS_NAMES from '../className'

export default function(pallet, originalData, typeDefinition) {
  if (
    diff(
      originalData.configuration,
      Object.assign({}, originalData.configuration, typeDefinition.config)
    )
  ) {
    pallet
      .querySelector(`.${CLASS_NAMES.buttonWrite}`)
      .classList.add(CLASS_NAMES.buttonWriteTransit)
  } else {
    pallet
      .querySelector(`.${CLASS_NAMES.buttonWrite}`)
      .classList.remove(CLASS_NAMES.buttonWriteTransit)
  }
}
