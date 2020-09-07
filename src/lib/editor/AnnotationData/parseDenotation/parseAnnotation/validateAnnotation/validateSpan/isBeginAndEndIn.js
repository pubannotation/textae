import isInText from './isInText'

export default function(annotation, text) {
  return (
    isInText(annotation.span.begin, text) && isInText(annotation.span.end, text)
  )
}
