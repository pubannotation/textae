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
      this._arrow.update(
        isSelected || true,
        isSelected || true,
        isSelected || true
      )

      this._isHovered = true
      this._redrawLabel(isSelected)
    }
  }

  pointUpPathAndSourceBollards(isSelected) {
    this._arrow.update(
      isSelected || true,
      isSelected || true,
      isSelected || false
    )
    this._redrawLabel(isSelected)
  }

  pointUpPathAndTargetBollards(isSelected) {
    this._arrow.update(
      isSelected || true,
      isSelected || false,
      isSelected || true
    )
    this._redrawLabel(isSelected)
  }

  pointUpSourceBollards(isSelected) {
    this._arrow.update(
      isSelected || false,
      isSelected || true,
      isSelected || false
    )
    this._redrawLabel(isSelected)
  }

  pointUpTargetBollards(isSelected) {
    this._arrow.update(
      isSelected || false,
      isSelected || false,
      isSelected || true
    )
    this._redrawLabel(isSelected)
  }

  pointUpSourceBollardsAndTargetBollards(isSelected) {
    this._arrow.update(
      isSelected || false,
      isSelected || true,
      isSelected || true
    )
    this._redrawLabel(isSelected)
  }

  pointDownPath(isSelected) {
    this._arrow.update(
      isSelected || false,
      isSelected || false,
      isSelected || false
    )

    this._isHovered = false
    this._redrawLabel(isSelected)
  }

  redraw(isSelected) {
    this._arrow.update(
      isSelected || this._isHovered,
      isSelected || this._isHovered,
      isSelected || this._isHovered
    )
    this._redrawLabel(isSelected)
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

  _redrawLabel(isSelected) {
    this._label.redraw(
      this._arrow.left,
      this._arrow.top,
      this._arrow.width,
      this._relation,
      isSelected,
      this._isHovered
    )
  }
}
