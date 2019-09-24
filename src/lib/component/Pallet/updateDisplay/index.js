import clear from './clear'
import updateLockState from './updateLockState'
import updateTitle from './updateTitle'
import updateNoConfigText from './updateNoConfigText'
import updateBGColorClass from './updateBGColorClass'
import appendRows from './appendRows'
import setWidthWithinWindow from './setWidthWithinWindow'
import setHeightWithinWindow from './setHeightWithinWindow'
import updateWriteButton from './updateWriteButton'

export default function(
  pallet,
  typeContainer,
  handlerType,
  originalData,
  typeDefinition
) {
  if (typeContainer) {
    clear(pallet)
    appendRows(pallet, typeContainer)
    updateLockState(pallet, typeContainer.isLock)
    updateTitle(pallet, handlerType)
    updateNoConfigText(pallet, handlerType)
    updateBGColorClass(pallet, handlerType)
    setWidthWithinWindow(pallet)
    setHeightWithinWindow(pallet)
    updateWriteButton(pallet, originalData, typeDefinition)
  }
}
