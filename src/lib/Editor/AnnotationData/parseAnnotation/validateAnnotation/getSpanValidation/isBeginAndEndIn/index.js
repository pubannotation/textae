import isInText from './isInText'

export default function (text, span) {
  return isInText(span.begin, text) && isInText(span.end, text)
}
