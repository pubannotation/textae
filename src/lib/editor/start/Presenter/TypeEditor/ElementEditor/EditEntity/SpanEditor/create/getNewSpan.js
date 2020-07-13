import Positions from '../Positions'

export default function(
  annotationData,
  spanAdjuster,
  selectionWrapper,
  spanConfig
) {
  const positions = new Positions(annotationData, selectionWrapper)

  return {
    begin: spanAdjuster.backFromBegin(
      annotationData.sourceDoc,
      positions.begin,
      spanConfig
    ),
    end:
      spanAdjuster.forwardFromEnd(
        annotationData.sourceDoc,
        positions.end - 1,
        spanConfig
      ) + 1
  }
}
