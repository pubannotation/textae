import Positions from '../../Positions'

export default function(annotationData, spanAdjuster, selection, spanConfig) {
  const positions = new Positions(annotationData, selection)

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
