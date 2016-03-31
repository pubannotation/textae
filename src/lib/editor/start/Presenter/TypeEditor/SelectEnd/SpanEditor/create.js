import {
  isBoundaryCrossingWithOtherSpans as isBoundaryCrossingWithOtherSpans
}
from '../../../../../Model/AnnotationData/parseAnnotation/validateAnnotation'
import isAlreadySpaned from '../../../../../Model/isAlreadySpaned'
import * as selectPosition from '../selectPosition'

const BLOCK_THRESHOLD = 100

export default function(model, command, typeContainer, spanAdjuster, isDetectDelimiterEnable, isReplicateAuto, selection, spanConfig) {
  model.selectionModel.clear()

  const newSpan = getNewSpan(model, spanAdjuster, selection, spanConfig)

  // The span cross exists spans.
  if (isBoundaryCrossingWithOtherSpans(
      model.annotationData.span.all(),
      newSpan
    )) {
    return
  }

  // The span exists already.
  if (isAlreadySpaned(model.annotationData.span.all(), newSpan)) {
    return
  }

  const commands = createCommands(command, typeContainer, newSpan, isReplicateAuto, isDetectDelimiterEnable, spanConfig)

  command.invoke(commands)
}

function createCommands(command, typeContainer, newSpan, isReplicateAuto, isDetectDelimiterEnable, spanConfig) {
  const commands = [command.factory.spanCreateCommand(
    typeContainer.entity.getDefaultType(), {
      begin: newSpan.begin,
      end: newSpan.end
    }
  )]

  if (isReplicateAuto && newSpan.end - newSpan.begin <= BLOCK_THRESHOLD) {
    commands.push(
      command.factory.spanReplicateCommand(
        typeContainer.entity.getDefaultType(), {
          begin: newSpan.begin,
          end: newSpan.end
        },
        isDetectDelimiterEnable ? spanConfig.isDelimiter : null
      )
    )
  }

  return commands
}

function getNewSpan(model, spanAdjuster, selection, spanConfig) {
  const [begin, end] = selectPosition.getBeginEnd(model.annotationData, selection)

  return {
    begin: spanAdjuster.backFromBegin(model.annotationData.sourceDoc, begin, spanConfig),
    end: spanAdjuster.forwardFromEnd(model.annotationData.sourceDoc, end - 1, spanConfig) + 1
  }
}
