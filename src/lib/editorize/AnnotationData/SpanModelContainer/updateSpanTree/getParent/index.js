import isChildOf from './isChildOf'

export default function getParet(span, parent) {
  if (isChildOf(span, parent)) {
    return parent
  } else if (parent.parent) {
    return getParet(span, parent.parent)
  } else {
    return null
  }
}
