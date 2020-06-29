import arrangeGridPosition from './arrangeGridPosition'

export default function(domPositionCache, annotationData, gridHeight, span) {
  return new Promise((resolve, reject) => {
    requestAnimationFrame(() => {
      try {
        arrangeGridPosition(domPositionCache, annotationData, gridHeight, span)
        resolve()
      } catch (error) {
        console.error(error, error.stack)
        reject()
      }
    })
  })
}
