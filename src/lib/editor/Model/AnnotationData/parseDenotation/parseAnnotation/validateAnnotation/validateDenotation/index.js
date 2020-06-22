import validate from '../validate'
import hasLength from './hasLength'
import isBeginAndEndIn from './isBeginAndEndIn'
import isInParagraph from './isInParagraph'
import isNotSpanCrossing from './isNotSpanCrossing'

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
    isNotSpanCrossing
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
