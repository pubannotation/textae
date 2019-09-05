import bindClickResetHiddenMessageBoxes from './bindClickResetHiddenMessageBoxes'
import bindChangeLockConfig from './bindChangeLockConfig'
import bindChangeLineHeight from './bindChangeLineHeight'
import bindChangeTypeGap from './bindChangeTypeGap'

export default function(content, editor, displayInstance, typeDefinition) {
  bindChangeTypeGap(content, editor[0], displayInstance)
  bindChangeLineHeight(content, editor[0])
  bindChangeLockConfig(content, typeDefinition)
  bindClickResetHiddenMessageBoxes(content, editor)
}
