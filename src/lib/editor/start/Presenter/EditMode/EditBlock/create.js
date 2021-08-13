import getNewSpan from '../getNewSpan'
import validateNewBlockSpan from './validateNewBlockSpan'

export default function (
  annotationData,
  commander,
  spanAdjuster,
  selectionWrapper,
  spanConfig
) {
  const { begin, end } = getNewSpan(
    annotationData,
    spanAdjuster,
    selectionWrapper,
    spanConfig
  )

  if (validateNewBlockSpan(annotationData, begin, end)) {
    const command = commander.factory.createBlockSpanCommand({
      begin,
      end
    })

    commander.invoke(command)
  }
}
