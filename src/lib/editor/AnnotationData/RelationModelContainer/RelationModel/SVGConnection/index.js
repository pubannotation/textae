import Arrow from './Arrow'
import Label from './Label'

export default class SVGConnection {
  constructor(relation, namespace, definitionContainer, onClick, editor) {
    this._relation = relation
    this._namespace = namespace
    this._definitionContainer = definitionContainer
    this._onClick = onClick
    this._editor = editor
    this._relationBox = editor[0].querySelector('.textae-editor__relation-box')

    this._createPath(false)
    this._createLabel(false)
  }

  destroy() {
    this._destoryPath()
  }

  select() {
    if (!this._isSelected) {
      this._isSelected = true
      this.destroy()
      this._createPath(true)
      this._createLabel(true)
    }
  }

  deselect() {
    if (this._isSelected) {
      this._isSelected = false
      this.recreate()
    }
  }

  pointUp() {
    if (!this._isSelected && !this._isHovered) {
      this._isHovered = true

      this._destoryPath()
      this._createPath(true)
      this._createLabel(true)
    }
  }

  pointDown() {
    if (!this._isSelected && this._isHovered) {
      this._isHovered = false
      this.recreate()
    }
  }

  recreate() {
    this.destroy()
    if (this._isSelected) {
      this._createPath(true)
      this._createLabel(true)
    } else {
      this._createPath(false)
      this._createLabel(false)
    }
  }

  // Private APIs
  _createPath(isBold) {
    const annotationBox = this._editor[0]
      .querySelector('.textae-editor__annotation-box')
      .getBoundingClientRect()
    const sourceEndpoint = this._relation.sourceEndpoint.getBoundingClientRect()
    const targetEndpoint = this._relation.targetEndpoint.getBoundingClientRect()

    this._arrow = new Arrow(
      this._relationBox,
      sourceEndpoint,
      targetEndpoint,
      annotationBox,
      this._relation.color,
      this._onClick,
      () => this.pointUp(),
      () => this.pointDown(),
      isBold
    )
  }

  _createLabel(isBold) {
    const labelX = this._arrow.center
    const labelY = this._arrow.top - 2

    this._label = new Label(
      this._relationBox,
      labelX,
      labelY,
      `[${this._relation.id}] ${this._relation.displayName}`,
      this._relation.href,
      'yellow',
      this._onClick,
      isBold
    )
  }

  _destoryPath() {
    this._arrow.destructor()
    this._label.destructor()
  }
}
