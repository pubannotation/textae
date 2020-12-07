import bindClickResetHiddenMessageBoxes from './bindClickResetHiddenMessageBoxes'
import bindChangeLockConfig from './bindChangeLockConfig'
import bindChangeLineHeight from './bindChangeLineHeight'
import bindChangeTypeGap from './bindChangeTypeGap'

export default function (content, editor, entityGap, typeDefinition, textBox) {
  bindChangeTypeGap(content, entityGap, textBox)
  bindChangeLineHeight(content, textBox)
  bindChangeLockConfig(content, typeDefinition)
  bindClickResetHiddenMessageBoxes(content, editor)
}
