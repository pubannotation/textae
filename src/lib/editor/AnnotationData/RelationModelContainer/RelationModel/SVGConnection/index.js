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

  pointDownPath(isSelected) {
    if (this._isHovered) {
      this._isHovered = false
      this.redraw(isSelected)
    }
  }

  redraw(isSelected) {
    const annotationBox = this._annotationBox.getBoundingClientRect()
    this._arrow.update(annotationBox, isSelected || this._isHovered)

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

    const annotationBox = this._annotationBox.getBoundingClientRect()
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
      this._onMouseEnter,
      this._onMouseLeave,
      isSelected,
      isHovered
    )
  }
}
