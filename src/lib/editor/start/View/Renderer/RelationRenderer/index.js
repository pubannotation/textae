import ModificationRenderer from '../ModificationRenderer'
import getAnnotationBox from '../getAnnotationBox'
import DomPositionCache from '../../DomPositionCache'
import arrangePositionAll from './arrangePositionAll'
import makeJsPlumbInstance from './makeJsPlumbInstance'
import removeRelation from './removeRelation'
import setRenderLazy from './setRenderLazy'
import changeType from './changeType'
import changeJsPlumbModification from './changeJsPlumbModification'
import renderLazyRelationAll from './renderLazyRelationAll'

export default class {
  constructor(editor, annotationData, selectionModel, typeContainer) {
    this.editor = editor
    this.annotationData = annotationData
    this.selectionModel = selectionModel
    this.typeContainer = typeContainer
    this.modificationRenderer = new ModificationRenderer(annotationData)
    this.domPositionCache = new DomPositionCache(editor, annotationData.entity)
    this.jsPlumbInstance = makeJsPlumbInstance(getAnnotationBox(editor))
  }

  arrangePositionAll() {
    renderLazyRelationAll(this.annotationData.relation.all())
    arrangePositionAll(this.editor, this.annotationData, this.selectionModel, this.jsPlumbInstance)
  }

  reset() {
    this.jsPlumbInstance.reset()
    this.domPositionCache.connectCache.clear()
  }

  render(relation) {
    // Create a dummy relation when before moving grids after creation grids.
    // Because a jsPlumb error occurs when a relation between same points.
    // And entities of same length spans was same point before moving grids.
    setRenderLazy(this.jsPlumbInstance, this.editor, this.annotationData, this.typeContainer, this.modificationRenderer, relation)
  }

  change(relation) {
    changeType(this.editor, this.annotationData, this.typeContainer, this.selectionModel, relation)
  }

  changeAll() {
    this.annotationData.relation.all().map((relation) => {
      changeType(this.editor, this.annotationData, this.typeContainer, this.selectionModel, relation)
    })
  }

  changeModification(relation) {
    changeJsPlumbModification(this.editor, this.annotationData, this.modificationRenderer, relation)
  }

  remove(relation) {
    removeRelation(this.editor, this.annotationData, this.jsPlumbInstance, this.domPositionCache, relation)
  }
}
