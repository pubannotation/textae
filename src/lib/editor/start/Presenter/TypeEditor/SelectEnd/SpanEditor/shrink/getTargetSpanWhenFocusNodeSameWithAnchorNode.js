import * as isInSelected from './../isInSelected'

export default function(annotationData, selectionModel, selection) {
  if (
    isInSelected.isFocusInSelectedSpan(
      annotationData,
      selectionModel,
      selection
    )
  ) {
    return selectionModel.span.single()
  }

  return selection.focusNode.parentElement.id
}
