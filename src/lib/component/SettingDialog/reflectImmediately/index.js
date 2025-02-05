import bindChangeLockConfig from './bindChangeLockConfig'
import bindChangeLineHeight from './bindChangeLineHeight'
import bindChangeTypeGap from './bindChangeTypeGap'
import bindChangeAutocompletionWs from './bindChangeAutocompletionWs'
import bindChangeAutoSave from './bindChangeAutoSave'
import bindChangeAutoLineHeight from './bindChangeAutoLineHeight'
import bindChangeBoundaryDetection from './bindChangeBoundaryDetection'
import bindChangeDelimiterCharacters from './bindChangeDelimiterCharacters'
import bindChangeBlankCharacters from './bindChangeBlankCharacters'
import bindChangeFunctionAvailability from './bindChangeFunctionAvailability'

export default function (
  content,
  eventEmitter,
  menuState,
  typeGap,
  typeDictionary,
  textBox,
  configuration,
  spanConfig,
  functionAvailability
) {
  bindChangeTypeGap(content, typeGap, textBox)
  bindChangeLineHeight(content, textBox)
  bindChangeAutocompletionWs(content, typeDictionary)
  bindChangeLockConfig(content, typeDictionary)
  bindChangeAutoSave(content, menuState, configuration)
  bindChangeAutoLineHeight(content, menuState, configuration)
  bindChangeBoundaryDetection(content, menuState, configuration)
  bindChangeDelimiterCharacters(content, spanConfig)
  bindChangeBlankCharacters(content, spanConfig)
  bindChangeFunctionAvailability(content, eventEmitter, functionAvailability)
}
