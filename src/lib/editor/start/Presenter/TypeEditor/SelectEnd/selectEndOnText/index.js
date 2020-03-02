import clearTextSelection from '../../clearTextSelection'
import validateOnText from './validateOnText'

export default function(spanEditor, annotationData, data) {
  const isValid = validateOnText(
    annotationData,
    data.spanConfig,
    data.selection
  )
  if (isValid) {
    // The parent of the focusNode is the paragraph.
    // Same paragraph check is done in the validateOnText.
    if (
      data.selection.anchorNode.parentNode.classList.contains(
        'textae-editor__body__text-box__paragraph'
      )
    ) {
      spanEditor.create(data)
    } else if (
      data.selection.anchorNode.parentNode.classList.contains(
        'textae-editor__span'
      )
    ) {
      spanEditor.expand(data)
    }
  }
  clearTextSelection()
}
