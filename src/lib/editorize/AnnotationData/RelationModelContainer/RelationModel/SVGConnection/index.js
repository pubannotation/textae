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
    this._arrow = this._createArrow()
    this._createLabel()
  }

  destroy() {
    this._arrow.destructor()
    this._label.destructor()
  }

  pointUpPathAndSourceBollards() {
    this._arrow.update(true, true, this._relation.isSelected)
    this._updateLabelAppearance()
  }

  pointUpPathAndTargetBollards() {
    this._arrow.update(true, this._relation.isSelected, true)
    this._updateLabelAppearance()
  }

  pointUpSourceBollards() {
    this._arrow.update(
      this._relation.isSelected,
      true,
      this._relation.isSelected
    )
    this._updateLabelAppearance()
  }

  pointUpTargetBollards() {
    this._arrow.update(
      this._relation.isSelected,
      this._relation.isSelected,
      true
    )
    this._updateLabelAppearance()
  }

  pointUpSourceBollardsAndTargetBollards() {
    this._arrow.update(this._relation.isSelected, true, true)
    this._updateLabelAppearance()
  }

  pointUpPath() {
    this._arrow.update(true, true, true)
    this._updateLabelAppearance()
  }

  pointDownPath() {
    this._arrow.update(
      this._relation.isSelected,
      this._relation.isSelected,
      this._relation.isSelected
    )
    this._updateLabelAppearance()
  }

  updateValue() {
    this._arrow.update(
      this._relation.isSelected || this._relation.isHovered,
      this._relation.isSelected || this._relation.isHovered,
      this._relation.isSelected || this._relation.isHovered
    )

    this._label.updateValue(
      this._arrow.left,
      this._arrow.top,
      this._arrow.width
    )
  }

  updateLabelAppearance() {
    this._updateLabelAppearance()
  }

  // Private APIs
  _createArrow() {
    const arrow = new Arrow(
      this._relationBox,
      this._relation,
      this._onClick,
      this._onMouseEnter,
      this._onMouseLeave
    )
    arrow.update(false, false, false)
    return arrow
  }

  _createLabel() {
    this._label = new Label(
      this._annotationBox,
      this._relation,
      this._onClick,
      this._onMouseEnter,
      this._onMouseLeave
    )
    this._label.updatePosition(
      this._arrow.left,
      this._arrow.top,
      this._arrow.width
    )
  }

  _updateLabelAppearance() {
    this._label.updateAppearanceState(
      this._arrow.left,
      this._arrow.top,
      this._arrow.width,
      this._relation.isHovered
    )
  }
}
