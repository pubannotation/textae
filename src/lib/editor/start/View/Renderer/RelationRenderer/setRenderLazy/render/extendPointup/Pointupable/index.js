import pointup from './pointup'
import pointdown from './pointdown'
import select from './select'
import deselect from './deselect'

export default class {
  constructor(editor, annotationData, typeContainer, connect) {
    this.editor = editor
    this.annotationData = annotationData
    this.typeContainer = typeContainer
    this.connect = connect
  }

  pointup() {
    pointup(this.connect, this.annotationData, this.typeContainer, this.connect.relationId)
  }

  pointdown() {
    pointdown(this.connect, this.annotationData, this.typeContainer, this.connect.relationId)
  }

  select() {
    select(this.connect, this.editor, this.annotationData, this.typeContainer, this.connect.relationId)
  }

  deselect() {
    deselect(this.connect, this.annotationData, this.typeContainer, this.connect.relationId)
  }
}
