import getAnnotationBox from '../../../getAnnotationBox'
import Arrow from './Arrow/inedx'
import Label from './Label'

export default class SVGConnection {
  constructor(
    editor,
    relation,
    namespace,
    definitionContainer,
    onClick,
    onMouseEnter,
    onMouseLeave
  ) {
    this._editor = editor
    this._relation = relation
    this._namespace = namespace
    this._definitionContainer = definitionContainer
    this._onClick = onClick
    this._onMouseEnter = onMouseEnter
    this._onMouseLeave = onMouseLeave
    this._relationBox = editor[0].querySelector('.textae-editor__relation-box')
    this._annotationBox = getAnnotationBox(editor)
    this._createArrow()
    this._createLabel(false, false)
    this._isHovered = false
  }

  destroy() {
    this._arrow.destructor()
    this._label.destructor()
  }

  pointUpPath(isSelected) {
    if (!this._isHovered) {
      this._isHovered = true
      this.redraw(isSelected)
    }
  }

  pointUpPathAndSourceBollards(isSelected) {
    this._arrow.update(
      isSelected || true,
      isSelected || true,
      isSelected || false
    )
    this._label.redraw(
      this._arrow.left,
      this._arrow.top,
      this._arrow.width,
      this._relation,
      isSelected,
      this._isHovered
    )
  }

  pointUpPathAndTargetBollards(isSelected) {
    this._arrow.update(
      isSelected || true,
      isSelected || false,
      isSelected || true
    )
    this._label.redraw(
      this._arrow.left,
      this._arrow.top,
      this._arrow.width,
      this._relation,
      isSelected,
      this._isHovered
    )
  }

  pointUpSourceBollards(isSelected) {
    this._arrow.update(
      isSelected || false,
      isSelected || true,
      isSelected || false
    )
    this._label.redraw(
      this._arrow.left,
      this._arrow.top,
      this._arrow.width,
      this._relation,
      isSelected,
      this._isHovered
    )
  }

  pointUpTargetBollards(isSelected) {
    this._arrow.update(
      isSelected || false,
      isSelected || false,
      isSelected || true
    )
    this._label.redraw(
      this._arrow.left,
      this._arrow.top,
      this._arrow.width,
      this._relation,
      isSelected,
      this._isHovered
    )
  }

  pointUpSourceBollardsAndTargetBollards(isSelected) {
    this._arrow.update(
      isSelected || false,
      isSelected || true,
      isSelected || true
    )
    this._label.redraw(
      this._arrow.left,
      this._arrow.top,
      this._arrow.width,
      this._relation,
      isSelected,
      this._isHovered
    )
  }

  pointDownPath(isSelected) {
    this._isHovered = false
    this.redraw(isSelected)
  }

  redraw(isSelected) {
    this._arrow.update(
      isSelected || this._isHovered,
      isSelected || this._isHovered,
      isSelected || this._isHovered
    )
    this._label.redraw(
      this._arrow.left,
      this._arrow.top,
      this._arrow.width,
      this._relation,
      isSelected,
      this._isHovered
    )
  }

  // Private APIs
  _createArrow() {
    this._arrow = new Arrow(
      this._relationBox,
      this._relation,
      this._onClick,
      this._onMouseEnter,
      this._onMouseLeave
    )
    this._arrow.update(false, false, false)
  }

  _createLabel(isSelected, isHovered) {
    this._label = new Label(
      this._annotationBox,
      this._arrow.left,
      this._arrow.top,
      this._arrow.width,
      this._relation,
      this._onClick,
      this._onMouseEnter,
      this._onMouseLeave,
      isSelected,
      isHovered
    )
  }
}
