import DomPositionCache from '../DomPositionCache'
import arrangeGridPositionPromise from './arrangeGridPositionPromise'

// Management position of annotation components.
export default function(editor, annotationData, typeContainer) {
  const domPositionCaChe = new DomPositionCache(editor, annotationData.entity),
    arrangePositionAll = (typeGap) => {
      domPositionCaChe.reset()
      return Promise.all(genArrangeAllGridPositionPromises(domPositionCaChe, typeContainer, typeGap, annotationData))
    }

  return {
    arrangePosition: arrangePositionAll
  }
}

function genArrangeAllGridPositionPromises(domPositionCaChe, typeContainer, typeGap, annotationData) {
  return annotationData.span.all()
    // There is at least one type in span that has a grid.
    .filter((span) => span.getTypes().length > 0)
    .map((span) => {
      // Cache all span position because alternating between getting offset and setting offset.
      domPositionCaChe.getSpan(span.id)
      return span
    })
    .map((span) => arrangeGridPositionPromise(domPositionCaChe, typeContainer, typeGap, annotationData, span))
}
