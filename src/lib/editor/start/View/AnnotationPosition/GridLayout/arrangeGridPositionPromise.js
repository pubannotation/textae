import arrangeGridPosition from './arrangeGridPosition'

export default function(domPositionCache, annotationData, typeGap, span) {
  return new Promise((resolve, reject) => {
    requestAnimationFrame(() => {
      try {
        arrangeGridPosition(domPositionCache, annotationData, typeGap, span)
        resolve()
      } catch (error) {
        console.error(error, error.stack)
        reject()
      }
    })
  })
}
