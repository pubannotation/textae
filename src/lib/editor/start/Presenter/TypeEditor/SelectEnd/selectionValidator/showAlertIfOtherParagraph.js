import deferAlert from '../deferAlert'

export default function(selection) {
  if (isInSameParagraph(selection)) {
    return true
  }

  deferAlert(
    'It is ambiguous for which span you want to adjust the boundary. Select the span, and try again.'
  )
  return false
}

function isInSameParagraph(selection) {
  const anchorParagraph = getParagraph(selection.anchorNode),
    focusParagraph = getParagraph(selection.focusNode)

  return anchorParagraph === focusParagraph
}

function getParagraph(node) {
  return node.parentElement.closest('.textae-editor__body__text-box__paragraph')
}
