import OrderedPositions from './OrderedPositions'

export default function (
  annotationData,
  spanAdjuster,
  selectionWrapper,
  spanConfig
) {
  const { positionsOnAnnotation } = selectionWrapper
  const orderedPositions = new OrderedPositions(positionsOnAnnotation)

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
