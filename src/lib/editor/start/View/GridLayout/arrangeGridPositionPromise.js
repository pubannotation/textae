import arrangeGridPosition from './arrangeGridPosition'

export default function(domPositionCaChe, typeContainer, typeGapValue, annotationData, span) {
  return new Promise(function(resolve, reject) {
    requestAnimationFrame(() => {
      try {
        arrangeGridPosition(domPositionCaChe, typeContainer, typeGapValue, annotationData, span)
        resolve()
      } catch (error) {
        console.error(error, error.stack)
        reject()
      }
    })
  })
}
