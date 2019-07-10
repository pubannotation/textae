import bindClickResetHiddenMessageBoxes from "./bindClickResetHiddenMessageBoxes"
import bindChangeLockConfig from "./bindChangeLockConfig"
import bindChangeLineHeight from "./bindChangeLineHeight"
import bindChangeTypeGap from "./bindChangeTypeGap"

export default function($content, editor, displayInstance) {
  bindChangeTypeGap($content, editor, displayInstance)
  bindChangeLineHeight($content, editor)
  bindChangeLockConfig($content, editor)
  bindClickResetHiddenMessageBoxes($content, editor)
}
