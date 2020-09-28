import pointup from './pointup'
import pointdown from './pointdown'
import select from './select'
import deselect from './deselect'

export default class {
  constructor(annotationData, typeDefinition, jsPlumbConnection, relationId) {
    this._annotationData = annotationData
    this._typeDefinition = typeDefinition
    this._jsPlumbConnection = jsPlumbConnection
    this._relationId = relationId
  }

  pointup() {
    pointup(
      this._jsPlumbConnection,
      this._annotationData,
      this._typeDefinition,
      this._relationId
    )
  }

  pointdown() {
    pointdown(
      this._jsPlumbConnection,
      this._annotationData,
      this._typeDefinition,
      this._relationId
    )
  }

  select() {
    select(
      this._jsPlumbConnection,
      this._annotationData,
      this._typeDefinition,
      this._relationId
    )
  }

  deselect() {
    deselect(
      this._jsPlumbConnection,
      this._annotationData,
      this._typeDefinition,
      this._relationId
    )
  }
}
