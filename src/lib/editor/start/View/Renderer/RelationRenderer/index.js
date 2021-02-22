import getAnnotationBox from '../getAnnotationBox'
import makeJsPlumbInstance from './makeJsPlumbInstance'
import areEndpointsPrepared from './areEndpointsPrepared'

export default class RelationRenderer {
  constructor(editor, annotationData, selectionModel) {
    this._editor = editor
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._annotationBox = getAnnotationBox(editor)
    this._jsPlumbInstance = makeJsPlumbInstance(this._annotationBox)
  }

  arrangePositionAll() {
    // The jsPlumb error occurs when a relation between same points.
    // And entities of same length spans was same point before moving grids.
    // A relaiton will be rendered after moving grids.
    for (const relation of this._annotationData.relation.all) {
      if (relation.isRendered) {
        relation.resetCurviness()
      } else {
        // The grid and its endpoints may be destroyed
        // when the spans was moved repetitively by undo or redo.
        if (!areEndpointsPrepared(this._annotationData, relation.id)) {
          return
        }

        relation.renderElement(
          this._jsPlumbInstance,
          this._editor,
          this._annotationData,
          this._annotationData.typeDefinition,
          this._annotationBox
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
    relation.renderElementAgain()
  }

  changeType(typeName) {
    for (const relation of this._annotationData.relation.all) {
      // If the type name ends in a wildcard, look for the DOMs to update with a forward match.
      if (
        relation.typeName === typeName ||
        (typeName.lastIndexOf('*') === typeName.length - 1 &&
          relation.typeName.indexOf(typeName.slice(0, -1) === 0))
      ) {
        relation.renderElementAgain()
      }
    }
  }

  changeAll() {
    this._annotationData.relation.all.map((relation) => {
      relation.renderElementAgain()
    })
  }

  remove(relation) {
    relation.destroyElement()
  }
}
