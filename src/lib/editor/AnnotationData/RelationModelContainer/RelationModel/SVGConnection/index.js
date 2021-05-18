import getAnnotationBox from '../../../getAnnotationBox'
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
    this._createLabel(false, false)
  }

  destroy() {
    this._arrow.destructor()
    this._label.destructor()
  }

  select() {
    if (!this._isSelected) {
      this._isSelected = true
      this.redraw()
    }
  }

  deselect() {
    if (this._isSelected) {
      this._isSelected = false
      this.redraw()
    }
  }

  pointUpPath() {
    if (!this._isHovered) {
      this._isHovered = true
      this.redraw()
    }
  }

  pointDownPath() {
    if (this._isHovered) {
      this._isHovered = false
      this.redraw()
    }
  }

  redraw() {
    const annotationBox = this._editor[0]
      .querySelector('.textae-editor__annotation-box')
      .getBoundingClientRect()
    this._arrow.update(annotationBox, this._isSelected || this._isHovered)

    this._label.destructor()
    this._createLabel(this._isSelected, this._isHovered)
  }

  // Private APIs
  _createArrow() {
    const annotationBox = this._editor[0]
      .querySelector('.textae-editor__annotation-box')
      .getBoundingClientRect()

    this._arrow = new Arrow(
      this._relationBox,
      this._relation,
      this._onClick,
      () => this.pointUpPath(),
      () => this.pointDownPath()
    )
    this._arrow.update(annotationBox, false)
  }

  _createLabel(isSelected, isHovered) {
    this._label = new Label(
      this._annotationBox,
      this._arrow.left,
      this._arrow.top,
      this._arrow.width,
      this._relation,
      this._onClick,
      () => this.pointUpPath(),
      () => this.pointDownPath(),
      isSelected,
      isHovered
    )
  }
}
