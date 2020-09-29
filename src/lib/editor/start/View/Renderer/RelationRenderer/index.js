import getAnnotationBox from '../getAnnotationBox'
import arrangePositionAll from './arrangePositionAll'
import makeJsPlumbInstance from './makeJsPlumbInstance'
import setRenderLazy from './setRenderLazy'
import changeType from './changeType'
import renderLazyRelationAll from './renderLazyRelationAll'

export default class {
  constructor(editor, annotationData, selectionModel, typeDefinition) {
    this._editor = editor
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._typeDefinition = typeDefinition
    this._jsPlumbInstance = makeJsPlumbInstance(getAnnotationBox(editor))
  }

  arrangePositionAll() {
    renderLazyRelationAll(
      this._annotationData.relation.all,
      this._jsPlumbInstance,
      this._editor,
      this._annotationData,
      this._typeDefinition
    )
    arrangePositionAll(
      this._editor,
      this._annotationData,
      this._selectionModel,
      this._jsPlumbInstance
    )
  }

  reset() {
    this._jsPlumbInstance.reset()
  }

  render(relation) {
    // Create a dummy relation when before moving grids after creation grids.
    // Because a jsPlumb error occurs when a relation between same points.
    // And entities of same length spans was same point before moving grids.
    setRenderLazy(relation)
  }

  change(relation) {
    changeType(this._annotationData, this._typeDefinition, relation)
  }

  changeType(typeName) {
    for (const relation of this._annotationData.relation.all) {
      // If the type name ends in a wildcard, look for the DOMs to update with a forward match.
      if (
        relation.typeName === typeName ||
        (typeName.lastIndexOf('*') === typeName.length - 1 &&
          relation.typeName.indexOf(typeName.slice(0, -1) === 0))
      ) {
        changeType(this._annotationData, this._typeDefinition, relation)
      }
    }
  }

  changeAll() {
    this._annotationData.relation.all.map((relation) => {
      changeType(this._annotationData, this._typeDefinition, relation)
    })
  }

  remove(relation) {
    if (!relation.isRendered) {
      return
    }

    relation.deleteJsPlumbConnection(this._jsPlumbInstance)
  }
}
