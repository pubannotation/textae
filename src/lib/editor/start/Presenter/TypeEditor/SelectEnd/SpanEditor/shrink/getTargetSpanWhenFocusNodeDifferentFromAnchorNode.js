import * as isInSelected from './../isInSelected'

export default function(model, selection, id) {
  if (isInSelected.isFocusInSelectedSpan(model, selection)) {
    // If a span is selected, it is able to begin drag out of an outer span of the span and shrink the span.
    // The focus node should be at the selected node.
    // cf.
    // 1. Select an inner span.
    // 2. Begin Drug from out of an outside span to the selected span.
    // Shrink the selected span.
    return model.selectionModel.span.single()
  } else if (isForcusOneDownUnderAnchor(selection)) {
    // To shrink the span , belows are needed:
    // 1. The anchorNode out of the span and in the parent of the span.
    // 2. The foucusNode is in the span.
    return selection.focusNode.parentNode.id
  } else if (id) {
    return id
  }
}

function isForcusOneDownUnderAnchor(selection) {
  return selection.anchorNode.parentNode === selection.focusNode.parentNode.parentNode
}
