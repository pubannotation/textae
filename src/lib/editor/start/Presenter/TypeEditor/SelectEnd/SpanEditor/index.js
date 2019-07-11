import delimiterDetectAdjuster from '../../../spanAdjuster/delimiterDetectAdjuster'
import blankSkipAdjuster from '../../../spanAdjuster/blankSkipAdjuster'
import create from './create'
import expand from './expand'
import * as shrink from './shrink'

export default function(editor, annotationData, selectionModel, command, typeDefinition, isDetectDelimiterEnable, isReplicateAuto) {
  const spanAdjuster = isDetectDelimiterEnable ? delimiterDetectAdjuster : blankSkipAdjuster

  return {
    create: (data) => {
      selectionModel.clear()
      create(annotationData, command, typeDefinition, spanAdjuster, isDetectDelimiterEnable, isReplicateAuto, data.selection, data.spanConfig)
    },
    expand: (data) => expand(editor, annotationData, selectionModel, command, spanAdjuster, data.selection, data.spanConfig),
    shrinkCrossTheEar: (data) => shrink.crossTheEar(editor, annotationData, selectionModel, command, spanAdjuster, data.selection, data.spanConfig),
    shrinkPullByTheEar: (data) => shrink.pullByTheEar(editor, annotationData, selectionModel, command, spanAdjuster, data.selection, data.spanConfig)
  }
}
