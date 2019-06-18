import isChildOf from './isChildOf'

export default function getParet(editor, spanContainer, span, parent) {
  if (isChildOf(editor, spanContainer, span, parent)) {
    return parent
  } else if (parent.parent) {
    return getParet(editor, spanContainer, span, parent.parent)
  } else {
    return null
  }
}
