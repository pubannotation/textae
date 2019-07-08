import clear from './clear'
import updateLockState from './updateLockState'
import updateTitle from './updateTitle'
import updateNoConfigText from './updateNoConfigText'
import updateBGColorClass from './updateBGColorClass'
import appendRows from './appendRows'
import show from './show'
import setWidthWithinWindow from './setWidthWithinWindow'
import setHeightWithinWindow from './setHeightWithinWindow'
import updateWriteButton from './updateWriteButton'
import moveIntoWindow from './moveIntoWindow'

export default function(pallet, history, typeContainer, point, handlerType) {
  if (typeContainer) {
    clear(pallet)
    appendRows(pallet, typeContainer)
    updateLockState(pallet, typeContainer.isLock())
    updateTitle(pallet, handlerType)
    updateNoConfigText(pallet, handlerType)
    updateBGColorClass(pallet, handlerType)
    show(pallet)
    setWidthWithinWindow(pallet)
    setHeightWithinWindow(pallet)
    updateWriteButton(pallet, history)

    if (point) {
      moveIntoWindow(pallet, point)
    }
  }
}
