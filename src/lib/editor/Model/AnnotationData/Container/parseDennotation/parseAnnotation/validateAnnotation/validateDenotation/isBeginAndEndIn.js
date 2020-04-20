import isInText from './isInText'

export default function(denotation, text) {
  return (
    isInText(denotation.span.begin, text) && isInText(denotation.span.end, text)
  )
}
