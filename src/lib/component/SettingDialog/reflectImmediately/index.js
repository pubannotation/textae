import bindClickResetHiddenMessageBoxes from './bindClickResetHiddenMessageBoxes'
import bindChangeLockConfig from './bindChangeLockConfig'
import bindChangeLineHeight from './bindChangeLineHeight'
import bindChangeTypeGap from './bindChangeTypeGap'

export default function (content, editor, entityGap, typeDefinition, view) {
  bindChangeTypeGap(content, entityGap, view)
  bindChangeLineHeight(content, view)
  bindChangeLockConfig(content, typeDefinition)
  bindClickResetHiddenMessageBoxes(content, editor)
}
