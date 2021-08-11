import bindChangeLockConfig from './bindChangeLockConfig'
import bindChangeLineHeight from './bindChangeLineHeight'
import bindChangeTypeGap from './bindChangeTypeGap'

export default function (content, entityGap, typeDefinition, textBox) {
  bindChangeTypeGap(content, entityGap, textBox)
  bindChangeLineHeight(content, textBox)
  bindChangeLockConfig(content, typeDefinition)
}
