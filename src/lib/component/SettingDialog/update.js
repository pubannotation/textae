import updateLineHeight from './updateLineHeight'
import updateTypeGapEnable from './updateTypeGapEnable'
import updateTypeGapValue from './updateTypeGapValue'

export default function($dialog, editor, typeContainer, displayInstance) {
  updateTypeGapEnable(
      displayInstance,
      $dialog
  )
  updateTypeGapValue(
      displayInstance,
      $dialog
  )
  updateLineHeight(
      editor,
      $dialog
  )

  $dialog.find('.lock-config').prop('checked', typeContainer.isLock())
}
