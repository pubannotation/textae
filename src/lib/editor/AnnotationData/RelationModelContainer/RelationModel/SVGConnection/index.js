import getAnnotationBox from '../../../../getAnnotationBox'
import Arrow from './Arrow/inedx'
import Label from './Label'

export default class SVGConnection {
  constructor(relation, namespace, definitionContainer, onClick, editor) {
    this._relation = relation
    this._namespace = namespace
    this._definitionContainer = definitionContainer
    this._onClick = onClick
    this._editor = editor
    this._relationBox = editor[0].querySelector('.textae-editor__relation-box')
    this._annotationBox = getAnnotationBox(editor)

    this._createArrow()
    this._createLabel(false)
  }

  destroy() {
    this._arrow.destructor()
    this._label.destructor()
  }

  select() {
    if (!this._isSelected) {
      this._isSelected = true
      this.recreate()
    }
  }

  deselect() {
    if (this._isSelected) {
      this._isSelected = false
      this.recreate()
    }
  }

  pointUp() {
    if (!this._isHovered) {
      this._isHovered = true
      this.recreate()
    }
  }

  pointDown() {
    if (this._isHovered) {
      this._isHovered = false
      this.recreate()
    }
  }

  recreate() {
    const annotationBox = this._editor[0]
      .querySelector('.textae-editor__annotation-box')
      .getBoundingClientRect()
    this._arrow.update(
      annotationBox,
      this._relation.sourceEntity,
      this._relation.targetEntity,
      this._relation.color,
      this._relation.sourceColor,
      this._relation.targetColor,
      this._relation.title,
      this._isSelected || this._isHovered
    )

    this._label.destructor()
    this._createLabel(this._isSelected)
  }

  // Private APIs
  _createArrow() {
    const annotationBox = this._editor[0]
      .querySelector('.textae-editor__annotation-box')
      .getBoundingClientRect()

    this._arrow = new Arrow(
      this._relationBox,
      this._onClick,
      () => this.pointUp(),
      () => this.pointDown()
    )
    this._arrow.update(
      annotationBox,
      this._relation.sourceEntity,
      this._relation.targetEntity,
      this._relation.color,
      this._relation.sourceColor,
      this._relation.targetColor,
      this._relation.title,
      false
    )
  }

  _createLabel(isSelected) {
    this._label = new Label(
      this._annotationBox,
      this._arrow.left,
      this._arrow.top,
      this._arrow.width,
      this._relation,
      this._onClick,
      () => this.pointUp(),
      () => this.pointDown(),
      isSelected
    )
  }
}
