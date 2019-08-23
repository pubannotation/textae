import getDomPositionCache from '../../getDomPositionCache'
import genArrangeAllGridPositionPromises from './genArrangeAllGridPositionPromises'
import arrangeGridPosition from './arrangeGridPosition'

// Management position of annotation components.
export default class {
  constructor(editor, annotationData, typeDefinition) {
    this.editor = editor
    this.annotationData = annotationData
    this.typeDefinition = typeDefinition
    this.domPositionCache = getDomPositionCache(editor, annotationData.entity)
  }

  arrangePosition(typeGap) {
    this.domPositionCache.reset()

    for (const span of this.annotationData.span.all) {
      // Cache all span position because alternating between getting offset and setting offset.
      this.domPositionCache.getSpan(span.id)

      arrangeGridPosition(
        this.domPositionCache,
        this.typeDefinition,
        this.annotationData,
        typeGap,
        span
      )
    }
  }

  arrangePositionAsync(typeGap) {
    this.domPositionCache.reset()

    return Promise.all(
      genArrangeAllGridPositionPromises(
        this.domPositionCache,
        this.typeDefinition,
        this.annotationData,
        typeGap
      )
    )
  }
}
