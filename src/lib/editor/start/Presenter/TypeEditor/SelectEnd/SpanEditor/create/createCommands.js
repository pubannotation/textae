import CreateSpanAndAutoReplicateCommand from '../../../../../Commander/Factory/CreateSpanAndAutoReplicateCommand'
import TypeModel from '../../../../../../Model/AnnotationData/Container/SpanContainer/TypeModel'

const BLOCK_THRESHOLD = 100

export default function(
  commander,
  typeDefinition,
  newSpan,
  isReplicateAuto,
  isDetectDelimiterEnable,
  spanConfig
) {
  return commander.factory.createSpanAndAutoReplicateCommand(
    {
      begin: newSpan.begin,
      end: newSpan.end
    },
    [new TypeModel(typeDefinition.entity.defaultType)],
    isReplicateAuto,
    isDetectDelimiterEnable ? (char) => spanConfig.isDelimiter(char) : null
  )
}
