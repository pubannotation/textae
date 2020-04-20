import validate from '../validate'
import isBoundaryCrossingWithOtherSpans from '../../../../../../../isBoundaryCrossingWithOtherSpans'
import hasLength from './hasLength'
import isBeginAndEndIn from './isBeginAndEndIn'
import isInParagraph from './isInParagraph'

export default function(text, paragraph, denotations) {
  const resultHasLength = validate(denotations, hasLength)
  const resultInText = validate(resultHasLength.accept, isBeginAndEndIn, text)
  const resultInParagraph = validate(
    resultInText.accept,
    isInParagraph,
    paragraph
  )
  const resultIsNotCrossing = validate(
    resultInParagraph.accept,
    (denotation, _, index, array) => {
      const others = array.slice(0, index).map((d) => d.span)
      const isInvalid = isBoundaryCrossingWithOtherSpans(
        others,
        denotation.span
      )

      return !isInvalid
    }
  )
  const errorCount =
    resultHasLength.reject.length +
    resultInText.reject.length +
    resultInParagraph.reject.length +
    resultIsNotCrossing.reject.length

  return {
    accept: resultIsNotCrossing.accept,
    reject: {
      hasLength: resultHasLength.reject,
      inText: resultInText.reject,
      inParagraph: resultInParagraph.reject,
      isNotCrossing: resultIsNotCrossing.reject
    },
    hasError: errorCount !== 0
  }
}
