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

    // When you click on a relation to deselect it, the display of the relation will be in hover.
    // When you click on the body and deselect the relation, the display of the relation becomes non-hover.
    // To make this distinction, the hover state is retained.
    this._isHovered = false
  }

  destroy() {
    this._arrow.destructor()
    this._label.destructor()
  }

  pointUpPath(isSelected) {
    this._arrow.update(true, true, true)

    this._isHovered = true
    this._redrawLabel(this._isHovered)
  }

  pointUpPathAndSourceBollards(isSelected) {
    this._arrow.update(true, true, isSelected)
    this._redrawLabel(this._isHovered)
  }

  pointUpPathAndTargetBollards(isSelected) {
    this._arrow.update(true, isSelected, true)
    this._redrawLabel(this._isHovered)
  }

  pointUpSourceBollards(isSelected) {
    this._arrow.update(isSelected, true, isSelected)
    this._redrawLabel(this._isHovered)
  }

  pointUpTargetBollards(isSelected) {
    this._arrow.update(isSelected, isSelected, true)
    this._redrawLabel(this._isHovered)
  }

  pointUpSourceBollardsAndTargetBollards(isSelected) {
    this._arrow.update(isSelected, true, true)
    this._redrawLabel(this._isHovered)
  }

  pointDownPath(isSelected) {
    this._arrow.update(isSelected, isSelected, isSelected)

    this._isHovered = false
    this._redrawLabel(this._isHovered)
  }

  redraw(isSelected) {
    this._arrow.update(
      isSelected || this._isHovered,
      isSelected || this._isHovered,
      isSelected || this._isHovered
    )
    this._redrawLabel(this._isHovered)
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

  _redrawLabel(isHovered) {
    this._label.redraw(
      this._arrow.left,
      this._arrow.top,
      this._arrow.width,
      this._relation,
      isHovered
    )
  }
}
