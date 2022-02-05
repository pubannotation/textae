import createCommand from './createCommand'
import getNewSpan from '../../../getNewSpan'
import validateNewDennotationSpan from '../validateNewDennotationSpan'

export default function (
  sourceDoc,
  spanModelContainer,
  commander,
  spanAdjuster,
  isReplicateAuto,
  selectionWrapper,
  spanConfig,
  isDelimiterFunc
) {
  const { begin, end } = getNewSpan(
    sourceDoc,
    spanAdjuster,
    selectionWrapper,
    spanConfig
  )

  if (validateNewDennotationSpan(spanModelContainer, begin, end)) {
    const command = createCommand(
      commander,
      { begin, end },
      isReplicateAuto,
      isDelimiterFunc
    )

    commander.invoke(command)
  }
}
