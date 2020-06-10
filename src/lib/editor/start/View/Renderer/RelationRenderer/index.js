import getAnnotationBox from '../getAnnotationBox'
import getDomPositionCache from '../../getDomPositionCache'
import arrangePositionAll from './arrangePositionAll'
import makeJsPlumbInstance from './makeJsPlumbInstance'
import removeRelation from './removeRelation'
import setRenderLazy from './setRenderLazy'
import changeType from './changeType'
import renderLazyRelationAll from './renderLazyRelationAll'

export default class {
  constructor(editor, annotationData, selectionModel, typeDefinition) {
    this.editor = editor
    this.annotationData = annotationData
    this.selectionModel = selectionModel
    this.typeDefinition = typeDefinition
    this.domPositionCache = getDomPositionCache(editor, annotationData.entity)
    this.jsPlumbInstance = makeJsPlumbInstance(getAnnotationBox(editor))
  }

  arrangePositionAll() {
    renderLazyRelationAll(this.annotationData.relation.all)
    arrangePositionAll(
      this.editor,
      this.annotationData,
      this.selectionModel,
      this.jsPlumbInstance
    )
  }

  reset() {
    this.jsPlumbInstance.reset()
    this.domPositionCache.connectCache.clear()
  }

  render(relation) {
    // Create a dummy relation when before moving grids after creation grids.
    // Because a jsPlumb error occurs when a relation between same points.
    // And entities of same length spans was same point before moving grids.
    setRenderLazy(
      this.jsPlumbInstance,
      this.editor,
      this.annotationData,
      this.typeDefinition,
      relation
    )
  }

  change(relation) {
    changeType(
      this.editor,
      this.annotationData,
      this.typeDefinition,
      this.selectionModel,
      relation
    )
  }

  changeAll() {
    this.annotationData.relation.all.map((relation) => {
      changeType(
        this.editor,
        this.annotationData,
        this.typeDefinition,
        this.selectionModel,
        relation
      )
    })
  }

  remove(relation) {
    removeRelation(
      this.editor,
      this.annotationData,
      this.jsPlumbInstance,
      this.domPositionCache,
      relation
    )
  }
}
