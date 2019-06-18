import arrangeGridPosition from './arrangeGridPosition'

export default function(domPositionCache, typeContainer, typeGap, annotationData, span) {
  return new Promise(function(resolve, reject) {
    requestAnimationFrame(() => {
      try {
        arrangeGridPosition(domPositionCache, typeContainer, typeGap, annotationData, span)
        resolve()
      } catch (error) {
        console.error(error, error.stack)
        reject()
      }
    })
  })
}
