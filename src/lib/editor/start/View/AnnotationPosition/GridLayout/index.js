import DomPositionCache from '../../DomPositionCache'
import genArrangeAllGridPositionPromises from './genArrangeAllGridPositionPromises'

// Management position of annotation components.
export default class { 
  constructor(editor, annotationData, typeContainer) {
    this.editor = editor
    this.annotationData = annotationData
    this.typeContainer = typeContainer
    this.domPositionCache = new DomPositionCache(editor, annotationData.entity)
  }

  arrangePosition(typeGap) {
    this.domPositionCache.reset()
    return Promise.all(
      genArrangeAllGridPositionPromises(this.domPositionCache, this.typeContainer, this.annotationData, typeGap)
    )
  }
}


