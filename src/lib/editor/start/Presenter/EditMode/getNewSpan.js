import OrderedPositions from './OrderedPositions'
import Positions from './Positions'

export default function (
  annotationData,
  spanAdjuster,
  selectionWrapper,
  spanConfig
) {
  const positions = new Positions(annotationData, selectionWrapper)
  const orderedPositions = new OrderedPositions(positions)

  return {
    begin: spanAdjuster.backFromBegin(
      annotationData.sourceDoc,
      orderedPositions.begin,
      spanConfig
    ),
    end:
      spanAdjuster.forwardFromEnd(
        annotationData.sourceDoc,
        orderedPositions.end - 1,
        spanConfig
      ) + 1
  }
}
