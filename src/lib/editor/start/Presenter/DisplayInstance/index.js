import TypeGapCache from './TypeGapCache'
import event from '../EditMode/event'
require('toastr')

export default function(typeGap, editMode) {
  let showInstance = true,
    typeGapCache = new TypeGapCache()

  editMode
    .on(event.SHOW, function(argument) {
      showInstance = true
      updateTypeGap(showInstance, typeGap, typeGapCache)
    })
    .on(event.HIDE, function(argument) {
      showInstance = false
      updateTypeGap(showInstance, typeGap, typeGapCache)
    })

  return {
    showInstance: () => showInstance,
    changeTypeGap: (val) => changeTypeGap(showInstance, typeGap, typeGapCache, val),
    getTypeGap: () => typeGap(),
    notifyNewInstance: () => {
      if (!showInstance) toastr.success("an instance is created behind.")
    }
  }
}

function changeTypeGap(showInstance, typeGap, typeGapCache, value) {
  if (showInstance) {
    typeGapCache.setInstanceShow(value)
  } else {
    typeGapCache.setInstanceHide(value)
  }

  updateTypeGap(showInstance, typeGap, typeGapCache)
}

function updateTypeGap(showInstance, typeGap, typeGapCache) {
  if (showInstance) {
    typeGap.set(typeGapCache.instanceShow)
  } else {
    typeGap.set(typeGapCache.instanceHide)
  }
}
