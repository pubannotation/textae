export { hasSpan, hasParagraphs, hasSpanOrParagraphs }

function hasSpan($node) {
  return $node.hasClass('textae-editor__span')
}

function hasParagraphs($node) {
  return $node.hasClass('textae-editor__body__text-box__paragraph')
}

function hasSpanOrParagraphs($node) {
  return hasSpan($node) || hasParagraphs($node)
}
