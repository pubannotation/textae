import isChildOf from './isChildOf'

export default function getParet(spanContainer, span, parent) {
  if (isChildOf(spanContainer, span, parent)) {
    return parent
  } else if (parent.parent) {
    return getParet(spanContainer, span, parent.parent)
  } else {
    return null
  }
}
