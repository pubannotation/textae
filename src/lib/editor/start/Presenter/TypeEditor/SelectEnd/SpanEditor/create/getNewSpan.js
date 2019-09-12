import getBeginEnd from '../../getBeginEnd'

export default function(annotationData, spanAdjuster, selection, spanConfig) {
  const [begin, end] = getBeginEnd(annotationData, selection)
  return {
    begin: spanAdjuster.backFromBegin(
      annotationData.sourceDoc,
      begin,
      spanConfig
    ),
    end:
      spanAdjuster.forwardFromEnd(
        annotationData.sourceDoc,
        end - 1,
        spanConfig
      ) + 1
  }
}
