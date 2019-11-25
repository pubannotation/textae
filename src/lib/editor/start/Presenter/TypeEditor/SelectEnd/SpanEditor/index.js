import DelimiterDetectAdjuster from './DelimiterDetectAdjuster'
import BlankSkipAdjuster from './BlankSkipAdjuster'
import create from './create'
import expand from './expand'
import crossTheEar from './crossTheEar'
import pullByTheEar from './pullByTheEar'

export default function(
  editor,
  annotationData,
  selectionModel,
  commander,
  isDetectDelimiterEnable,
  isReplicateAuto
) {
  const spanAdjuster = isDetectDelimiterEnable
    ? new DelimiterDetectAdjuster()
    : new BlankSkipAdjuster()

  return {
    create: (data) => {
      selectionModel.clear()
      create(
        annotationData,
        commander,
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
