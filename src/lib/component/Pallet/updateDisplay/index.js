import { diff } from 'jsondiffpatch'
import updateBGColorClass from './updateBGColorClass'
import createContentHtml from './createContentHtml'
import setWidthWithinWindow from './setWidthWithinWindow'
import setHeightWithinWindow from './setHeightWithinWindow'

export default function(
  pallet,
  typeContainer,
  handlerType,
  originalData,
  typeDefinition
) {
  if (typeContainer) {
    const content = createContentHtml(
      typeContainer,
      handlerType,
      diff(
        originalData.configuration,
        Object.assign({}, originalData.configuration, typeDefinition.config)
      )
    )
    pallet.innerHTML = content
    updateBGColorClass(pallet, handlerType)
    setWidthWithinWindow(pallet)
    setHeightWithinWindow(pallet)
  }
}
