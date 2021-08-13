import createCommand from './createCommand'
import getNewSpan from '../../../getNewSpan'
import validateNewSpan from '../validateNewSpan'

export default function (
  annotationData,
  commander,
  spanAdjuster,
  isReplicateAuto,
  selectionWrapper,
  spanConfig,
  isDelimiterFunc
) {
  const { begin, end } = getNewSpan(
    annotationData,
    spanAdjuster,
    selectionWrapper,
    spanConfig
  )

  if (validateNewSpan(annotationData, begin, end)) {
    const command = createCommand(
      commander,
      { begin, end },
      isReplicateAuto,
      isDelimiterFunc
    )

    commander.invoke(command)
  }
}
