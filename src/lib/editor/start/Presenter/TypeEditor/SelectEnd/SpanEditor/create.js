import { isBoundaryCrossingWithOtherSpans } from '../../../../../Model/AnnotationData/parseAnnotation/validateAnnotation'
import isAlreadySpaned from '../../../../isAlreadySpaned'
import getBeginEnd from '../getBeginEnd'

const BLOCK_THRESHOLD = 100

export default function(
  annotationData,
  commander,
  typeDefinition,
  spanAdjuster,
  isDetectDelimiterEnable,
  isReplicateAuto,
  selection,
  spanConfig
) {
  const newSpan = getNewSpan(
    annotationData,
    spanAdjuster,
    selection,
    spanConfig
  )

  // The span cross exists spans.
  if (isBoundaryCrossingWithOtherSpans(annotationData.span.all, newSpan)) {
    return
  }

  // The span exists already.
  if (isAlreadySpaned(annotationData.span.all, newSpan)) {
    return
  }

  const commands = createCommands(
    commander,
    typeDefinition,
    newSpan,
    isReplicateAuto,
    isDetectDelimiterEnable,
    spanConfig
  )

  commander.invoke(commands)
}

function createCommands(
  commander,
  typeDefinition,
  newSpan,
  isReplicateAuto,
  isDetectDelimiterEnable,
  spanConfig
) {
  const commands = commander.factory.spanCreateCommand(
    typeDefinition.entity.getDefaultType(),
    {
      begin: newSpan.begin,
      end: newSpan.end
    }
  )

  if (isReplicateAuto && newSpan.end - newSpan.begin <= BLOCK_THRESHOLD) {
    commands.push(
      commander.factory.spanReplicateCommand(
        {
          begin: newSpan.begin,
          end: newSpan.end
        },
        [typeDefinition.entity.getDefaultType()],
        isDetectDelimiterEnable ? spanConfig.isDelimiter : null
      )
    )
  }

  return commands
}

function getNewSpan(annotationData, spanAdjuster, selection, spanConfig) {
  const [begin, end] = getBeginEnd(annotationData, selection)

  return {
    begin: spanAdjuster.backFromBegin(
      annotationData.sourceDoc,
      begin,
      spanConfig
    ),
    end:
      spanAdjuster.forwardFromEnd(
        annotationData.sourceDoc,
        end - 1,
        spanConfig
      ) + 1
  }
}
