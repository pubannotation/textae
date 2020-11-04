import bindClickResetHiddenMessageBoxes from './bindClickResetHiddenMessageBoxes'
import bindChangeLockConfig from './bindChangeLockConfig'
import bindChangeLineHeight from './bindChangeLineHeight'
import bindChangeTypeGap from './bindChangeTypeGap'

export default function (
  content,
  editor,
  displayInstance,
  typeDefinition,
  view
) {
  bindChangeTypeGap(content, displayInstance, view)
  bindChangeLineHeight(content, view)
  bindChangeLockConfig(content, typeDefinition)
  bindClickResetHiddenMessageBoxes(content, editor)
}
