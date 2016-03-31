import * as isInSelected from './../isInSelected'

export default function(model, selection) {
  if (isInSelected.isFocusInSelectedSpan(model, selection)) {
    return model.selectionModel.span.single()
  }

  return selection.focusNode.parentElement.id
}
