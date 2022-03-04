import getAnnotationBox from '../../../getAnnotationBox'
import Arrow from './Arrow'
import Label from './Label'

export default class Connection {
  constructor(
    editorHTMLElement,
    relation,
    namespace,
    definitionContainer,
    onClick,
    onMouseEnter,
    onMouseLeave,
    controlBarHeight
  ) {
    this._relation = relation
    this._namespace = namespace
    this._definitionContainer = definitionContainer
    this._onClick = onClick
    this._relationBox = editorHTMLElement.querySelector(
      '.textae-editor__relation-box'
    )
    this._annotationBox = getAnnotationBox(editorHTMLElement)
    this._arrow = new Arrow(
      this._relationBox,
      this._relation,
      controlBarHeight,
      this._onClick,
      () => onMouseEnter(this),
      onMouseLeave
    )
    this._label = new Label(
      this._annotationBox,
      this._relation,
      this._arrow,
      this._onClick,
      () => onMouseEnter(this),
      onMouseLeave
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

  updateLabelHighlighting() {
    this._label.updateHighlighting()
  }
}
