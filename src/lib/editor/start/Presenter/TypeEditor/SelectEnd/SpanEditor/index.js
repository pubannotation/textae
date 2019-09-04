import delimiterDetectAdjuster from './spanAdjuster/delimiterDetectAdjuster'
import blankSkipAdjuster from './spanAdjuster/blankSkipAdjuster'
import create from './create'
import expand from './expand'
import crossTheEar from './crossTheEar'
import pullByTheEar from './pullByTheEar'

export default function(
  editor,
  annotationData,
  selectionModel,
  commander,
  typeDefinition,
  isDetectDelimiterEnable,
  isReplicateAuto
) {
  const spanAdjuster = isDetectDelimiterEnable
    ? delimiterDetectAdjuster
    : blankSkipAdjuster

  return {
    create: (data) => {
      selectionModel.clear()
      create(
        annotationData,
        commander,
        typeDefinition,
        spanAdjuster,
        isDetectDelimiterEnable,
        isReplicateAuto,
        data.selection,
        data.spanConfig
      )
    },
    expand: (data) =>
      expand(
        annotationData,
        selectionModel,
        commander,
        spanAdjuster,
        data.selection,
        data.spanConfig
      ),
    shrinkCrossTheEar: (data) =>
      crossTheEar(
        editor,
        annotationData,
        selectionModel,
        commander,
        spanAdjuster,
        data.selection,
        data.spanConfig
      ),
    shrinkPullByTheEar: (data) =>
      pullByTheEar(
        editor,
        annotationData,
        selectionModel,
        commander,
        spanAdjuster,
        data.selection,
        data.spanConfig
      )
  }
}
