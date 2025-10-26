import bindChangeFunctionAvailability from './bindChangeFunctionAvailability'
import bindChangeLineHeight from './bindChangeLineHeight'
import bindChangeLockConfig from './bindChangeLockConfig'
import bindChangeTypeGap from './bindChangeTypeGap'

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
