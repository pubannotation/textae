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
    this._arrow = new Arrow(
      this._relationBox,
      this._relation,
      this._onClick,
      this._onMouseEnter,
      this._onMouseLeave
    )
    this._label = new Label(
      this._annotationBox,
      this._relation,
      this._arrow,
      this._onClick,
      this._onMouseEnter,
      this._onMouseLeave
    )
  }

  destroy() {
    this._arrow.destructor()
    this._label.destructor()
  }

  pointUpPathAndSourceBollards() {
    this._arrow.update(true, true, this._relation.isSelected)
    this._label.updateHighlighting()
  }

  pointUpPathAndTargetBollards() {
    this._arrow.update(true, this._relation.isSelected, true)
    this._label.updateHighlighting()
  }

  pointUpSourceBollards() {
    this._arrow.update(
      this._relation.isSelected,
      true,
      this._relation.isSelected
    )
    this._label.updateHighlighting()
  }

  pointUpTargetBollards() {
    this._arrow.update(
      this._relation.isSelected,
      this._relation.isSelected,
      true
    )
    this._label.updateHighlighting()
  }

  pointUpSourceBollardsAndTargetBollards() {
    this._arrow.update(this._relation.isSelected, true, true)
    this._label.updateHighlighting()
  }

  pointUpPath() {
    this._arrow.update(true, true, true)
    this._label.updateHighlighting()
  }

  pointDownPath() {
    this._arrow.update(
      this._relation.isSelected,
      this._relation.isSelected,
      this._relation.isSelected
    )
    this._label.updateHighlighting()
  }

  updateValue() {
    this._arrow.update(
      this._relation.isSelected || this._relation.isHovered,
      this._relation.isSelected || this._relation.isHovered,
      this._relation.isSelected || this._relation.isHovered
    )

    this._label.updateValue()
  }

  updateHighlighting() {
    this._label.updateHighlighting()
  }
}
