import createCommand from './createCommand'
import getNewSpan from '../../../getNewSpan'
import validateNewDennotationSpan from '../validateNewDennotationSpan'

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
    annotationData.sourceDoc,
    spanAdjuster,
    selectionWrapper,
    spanConfig
  )

  if (validateNewDennotationSpan(annotationData, begin, end)) {
    const command = createCommand(
      commander,
      { begin, end },
      isReplicateAuto,
      isDelimiterFunc
    )

    commander.invoke(command)
  }
}
