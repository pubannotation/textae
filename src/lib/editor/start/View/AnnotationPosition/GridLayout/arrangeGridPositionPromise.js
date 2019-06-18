import arrangeGridPosition from './arrangeGridPosition'

export default function(domPositionCache, typeContainer, annotationData, typeGap, span) {
  return new Promise(function(resolve, reject) {
    requestAnimationFrame(() => {
      try {
        arrangeGridPosition(domPositionCache, typeContainer, annotationData, typeGap, span)
        resolve()
      } catch (error) {
        console.error(error, error.stack)
        reject()
      }
    })
  })
}
