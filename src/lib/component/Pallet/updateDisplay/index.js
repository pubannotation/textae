import { diff } from 'jsondiffpatch'
import createContentHtml from './createContentHtml'
import setWidthWithinWindow from './setWidthWithinWindow'
import setHeightWithinWindow from './setHeightWithinWindow'

export default function(
  pallet,
  typeContainer,
  editModeName,
  originalData,
  typeDefinition
) {
  const content = createContentHtml(
    typeContainer,
    editModeName,
    diff(
      originalData.configuration,
      Object.assign({}, originalData.configuration, typeDefinition.config)
    )
  )
  pallet.innerHTML = content

  setWidthWithinWindow(pallet)
  setHeightWithinWindow(pallet)
}
