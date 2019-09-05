import updateTypeGap from './updateTypeGap'

export default function(showInstance, typeGap, typeGapCache, value) {
  if (showInstance) {
    typeGapCache.setInstanceShow(value)
  } else {
    typeGapCache.setInstanceHide(value)
  }
  updateTypeGap(showInstance, typeGap, typeGapCache)
}
