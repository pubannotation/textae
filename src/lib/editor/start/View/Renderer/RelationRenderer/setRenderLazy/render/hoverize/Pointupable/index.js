import pointup from './pointup'
import pointdown from './pointdown'
import select from './select'
import deselect from './deselect'

export default class {
  constructor(editor, annotationData, typeDefinition, connect) {
    this._editor = editor
    this._annotationData = annotationData
    this._typeDefinition = typeDefinition
    this._connect = connect
  }

  pointup() {
    pointup(
      this._connect,
      this._annotationData,
      this._typeDefinition,
      this._connect.relationId
    )
  }

  pointdown() {
    pointdown(
      this._connect,
      this._annotationData,
      this._typeDefinition,
      this._connect.relationId
    )
  }

  select() {
    select(
      this._connect,
      this._editor,
      this._annotationData,
      this._typeDefinition,
      this._connect.relationId
    )
  }

  deselect() {
    deselect(
      this._connect,
      this._annotationData,
      this._typeDefinition,
      this._connect.relationId
    )
  }
}
