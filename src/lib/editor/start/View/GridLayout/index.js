import DomPositionCache from '../DomPositionCache'
import arrangeGridPositionPromise from './arrangeGridPositionPromise'

// Management position of annotation components.
export default function(editor, annotationData, typeContainer) {
  const domPositionCache = new DomPositionCache(editor, annotationData.entity),
    arrangePositionAll = (typeGap) => {
      domPositionCache.reset()
      return Promise.all(genArrangeAllGridPositionPromises(domPositionCache, typeContainer, typeGap, annotationData))
    }

  return {
    arrangePosition: arrangePositionAll
  }
}

function genArrangeAllGridPositionPromises(domPositionCache, typeContainer, typeGap, annotationData) {
  return annotationData.span.all()
    // There is at least one type in span that has a grid.
    .filter((span) => span.getTypes().length > 0)
    .map((span) => {
      // Cache all span position because alternating between getting offset and setting offset.
      domPositionCache.getSpan(span.id)
      return span
    })
    .map((span) => arrangeGridPositionPromise(domPositionCache, typeContainer, typeGap, annotationData, span))
}
