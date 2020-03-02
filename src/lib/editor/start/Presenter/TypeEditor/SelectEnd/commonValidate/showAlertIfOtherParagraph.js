import deferAlert from '../deferAlert'

export default function(selectionWrapper) {
  if (selectionWrapper.isInSameParagraph()) {
    return true
  }

  deferAlert(
    'It is ambiguous for which span you want to adjust the boundary. Select the span, and try again.'
  )
  return false
}
