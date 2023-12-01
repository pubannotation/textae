import OrderedPositions from './OrderedPositions'

export default function (
  sourceDoc,
  spanAdjuster,
  selectionWrapper,
  spanConfig
) {
  const { positionsOnAnnotation } = selectionWrapper
  const orderedPositions = new OrderedPositions(positionsOnAnnotation)

  return {
    begin: spanAdjuster.backFromBegin(
      sourceDoc,
      orderedPositions.begin,
      spanConfig
    ),
    end:
      spanAdjuster.forwardFromEnd(
        sourceDoc,
        orderedPositions.end - 1,
        spanConfig
      ) + 1
  }
}
