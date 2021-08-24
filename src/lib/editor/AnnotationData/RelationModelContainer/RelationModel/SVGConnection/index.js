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
    this._createLabel()

    // When you click on a relation to deselect it, the display of the relation will be in hover.
    // When you click on the body and deselect the relation, the display of the relation becomes non-hover.
    // To make this distinction, the hover state is retained.
    this._isHovered = false
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

    this._isHovered = true
    this._updateLabelAppearance()
  }

  pointDownPath() {
    this._arrow.update(
      this._relation.isSelected,
      this._relation.isSelected,
      this._relation.isSelected
    )

    this._isHovered = false
    this._updateLabelAppearance()
  }

  updatePosition() {
    this._arrow.update(
      this._relation.isSelected || this._isHovered,
      this._relation.isSelected || this._isHovered,
      this._relation.isSelected || this._isHovered
    )

    this._label.updatePosition(
      this._arrow.left,
      this._arrow.top,
      this._arrow.width,
      this._relation
    )
  }

  updateValue() {
    this._arrow.update(
      this._relation.isSelected || this._isHovered,
      this._relation.isSelected || this._isHovered,
      this._relation.isSelected || this._isHovered
    )

    this._label.updateValue(
      this._arrow.left,
      this._arrow.top,
      this._arrow.width,
      this._relation
    )
  }

  updateLabelAppearance() {
    this._updateLabelAppearance()
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

  _createLabel() {
    this._label = new Label(
      this._annotationBox,
      this._arrow.left,
      this._arrow.top,
      this._arrow.width,
      this._relation,
      this._onClick,
      this._onMouseEnter,
      this._onMouseLeave
    )
  }

  _updateLabelAppearance() {
    this._label.updateAppearanceState(
      this._arrow.left,
      this._arrow.top,
      this._arrow.width,
      this._relation,
      this._isHovered
    )
  }
}
