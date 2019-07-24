import bindClickResetHiddenMessageBoxes from './bindClickResetHiddenMessageBoxes'
import bindChangeLockConfig from './bindChangeLockConfig'
import bindChangeLineHeight from './bindChangeLineHeight'
import bindChangeTypeGap from './bindChangeTypeGap'

export default function($content, editor, displayInstance, typeDefinition) {
  bindChangeTypeGap($content, editor, displayInstance)
  bindChangeLineHeight($content, editor)
  bindChangeLockConfig($content, typeDefinition)
  bindClickResetHiddenMessageBoxes($content, editor)
}
