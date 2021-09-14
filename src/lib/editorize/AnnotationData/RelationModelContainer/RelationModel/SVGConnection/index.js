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
    this._label.updateAppearanceState()
  }

  pointUpPathAndTargetBollards() {
    this._arrow.update(true, this._relation.isSelected, true)
    this._label.updateAppearanceState()
  }

  pointUpSourceBollards() {
    this._arrow.update(
      this._relation.isSelected,
      true,
      this._relation.isSelected
    )
    this._label.updateAppearanceState()
  }

  pointUpTargetBollards() {
    this._arrow.update(
      this._relation.isSelected,
      this._relation.isSelected,
      true
    )
    this._label.updateAppearanceState()
  }

  pointUpSourceBollardsAndTargetBollards() {
    this._arrow.update(this._relation.isSelected, true, true)
    this._label.updateAppearanceState()
  }

  pointUpPath() {
    this._arrow.update(true, true, true)
    this._label.updateAppearanceState()
  }

  pointDownPath() {
    this._arrow.update(
      this._relation.isSelected,
      this._relation.isSelected,
      this._relation.isSelected
    )
    this._label.updateAppearanceState()
  }

  updateValue() {
    this._arrow.update(
      this._relation.isSelected || this._relation.isHovered,
      this._relation.isSelected || this._relation.isHovered,
      this._relation.isSelected || this._relation.isHovered
    )

    this._label.updateValue()
  }

  updateLabelAppearance() {
    this._label.updateAppearanceState()
  }
}
