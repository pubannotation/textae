import deferAlert from '../../SelectEnd/deferAlert'

export default function(isInSameParagraph) {
  if (isInSameParagraph) {
    return false
  }

  deferAlert(
    'It is ambiguous for which span you want to adjust the boundary. Select the span, and try again.'
  )
  return true
}
