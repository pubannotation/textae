import {SPAN_CLASS, ENTINY_CLASS} from "./const"
import selectSelected from "./selectSelected"

export default function(editorDom, selectionModel, shiftKey, getNextFunc) {
  const selectedSpans = selectSelected(editorDom, SPAN_CLASS)

  if (selectedSpans.length) {
    const nextElement = getNextFunc(selectedSpans)
    return () => selectionModel.selectSpan(nextElement, shiftKey)
  }

  const selectedEntityLabel = selectSelected(editorDom, 'textae-editor__type-values')

  if (selectedEntityLabel.length) {
    const nextElement = getNextFunc(selectedEntityLabel)
    return () => selectionModel.selectEntityLabel(nextElement, shiftKey)
  }

  const selectedEntities = selectSelected(editorDom, ENTINY_CLASS)

  if (selectedEntities.length) {
    // return a select entity function
    const nextElement = getNextFunc(selectedEntities)
    return () => selectionModel.selectEntity(nextElement, shiftKey)
  }

  return () => { }
}
