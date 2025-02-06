import bindChangeLockConfig from './bindChangeLockConfig'
import bindChangeLineHeight from './bindChangeLineHeight'
import bindChangeTypeGap from './bindChangeTypeGap'
import bindChangeAutocompletionWs from './bindChangeAutocompletionWs'
import bindChangeDelimiterCharacters from './bindChangeDelimiterCharacters'
import bindChangeBlankCharacters from './bindChangeBlankCharacters'
import bindChangeFunctionAvailability from './bindChangeFunctionAvailability'

export default function (
  content,
  eventEmitter,
  typeGap,
  typeDictionary,
  textBox,
  spanConfig,
  functionAvailability
) {
  bindChangeTypeGap(content, typeGap, textBox)
  bindChangeLineHeight(content, textBox)
  bindChangeAutocompletionWs(content, typeDictionary)
  bindChangeLockConfig(content, typeDictionary)
  bindChangeDelimiterCharacters(content, spanConfig)
  bindChangeBlankCharacters(content, spanConfig)
  bindChangeFunctionAvailability(content, eventEmitter, functionAvailability)
}
