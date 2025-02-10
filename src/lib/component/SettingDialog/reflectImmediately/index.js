import bindChangeLockConfig from './bindChangeLockConfig'
import bindChangeLineHeight from './bindChangeLineHeight'
import bindChangeTypeGap from './bindChangeTypeGap'
import bindChangeFunctionAvailability from './bindChangeFunctionAvailability'

export default function (
  content,
  eventEmitter,
  typeGap,
  typeDictionary,
  textBox,
  functionAvailability
) {
  bindChangeTypeGap(content, typeGap, textBox)
  bindChangeLineHeight(content, textBox)
  bindChangeLockConfig(content, typeDictionary)
  bindChangeFunctionAvailability(content, eventEmitter, functionAvailability)
}
