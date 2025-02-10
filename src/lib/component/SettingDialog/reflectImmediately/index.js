import bindChangeLockConfig from './bindChangeLockConfig'
import bindChangeLineHeight from './bindChangeLineHeight'
import bindChangeTypeGap from './bindChangeTypeGap'
import bindChangeAutocompletionWs from './bindChangeAutocompletionWs'
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
  bindChangeAutocompletionWs(content, typeDictionary)
  bindChangeLockConfig(content, typeDictionary)
  bindChangeFunctionAvailability(content, eventEmitter, functionAvailability)
}
