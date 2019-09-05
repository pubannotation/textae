export default function(showInstance, typeGap, typeGapCache) {
  if (showInstance) {
    typeGap.set({
      value: typeGapCache.instanceShow,
      showInstance
    })
  } else {
    typeGap.set({
      value: typeGapCache.instanceHide,
      showInstance
    })
  }
}
