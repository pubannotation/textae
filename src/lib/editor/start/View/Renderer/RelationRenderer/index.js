import getAnnotationBox from '../getAnnotationBox'
import makeJsPlumbInstance from './makeJsPlumbInstance'
import changeType from './changeType'
import renderLazy from './renderLazy'

export default class RelationRenderer {
  constructor(editor, annotationData, selectionModel) {
    this._editor = editor
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._typeDefinition = annotationData.typeDefinition
    this._jsPlumbInstance = makeJsPlumbInstance(getAnnotationBox(editor))
  }

  arrangePositionAll() {
    for (const relation of this._annotationData.relation.all) {
      if (relation.isRendered) {
        relation.resetCurviness()
      } else {
        renderLazy(
          this._editor,
          this._annotationData,
          relation,
          this._jsPlumbInstance,
          this._typeDefinition
        )
      }
    }

    this._jsPlumbInstance.repaintEverything()

    for (const selectedRelation of this._selectionModel.relation.all) {
      if (selectedRelation.isRendered) {
        selectedRelation.jsPlumbConnection.select()
      }
    }
  }

  reset() {
    this._jsPlumbInstance.reset()
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
    relation.destroyElement()
  }
}
