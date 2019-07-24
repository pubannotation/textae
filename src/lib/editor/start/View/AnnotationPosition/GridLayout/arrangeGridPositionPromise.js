import arrangeGridPosition from './arrangeGridPosition'

export default function(
  domPositionCache,
  typeDefinition,
  annotationData,
  typeGap,
  span
) {
  return new Promise(function(resolve, reject) {
    requestAnimationFrame(() => {
      try {
        arrangeGridPosition(
          domPositionCache,
          typeDefinition,
          annotationData,
          typeGap,
          span
        )
        resolve()
      } catch (error) {
        console.error(error, error.stack)
        reject()
      }
    })
  })
}
