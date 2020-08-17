import selectSelected from './selectSelected'

export default function(editorDom, selectionModel, shiftKey, getNextFunc) {
  const selectedSpans = selectSelected(editorDom, 'textae-editor__span')

  if (selectedSpans.length) {
    const nextElement = getNextFunc(selectedSpans)
    return () => selectionModel.selectSpan(nextElement, shiftKey)
  }

  const selectedTypeValues = selectSelected(
    editorDom,
    'textae-editor__type-values'
  )

  if (selectedTypeValues.length) {
    const nextElement = getNextFunc(selectedTypeValues)
    return () => selectionModel.selectEntityLabel(nextElement, shiftKey)
  }

  const selectedEntities = selectSelected(editorDom, 'textae-editor__entity')

  if (selectedEntities.length) {
    // return a select entity function
    const nextElement = getNextFunc(selectedEntities)
    return () => selectionModel.selectEntity(nextElement, shiftKey)
  }

  return () => {}
}
