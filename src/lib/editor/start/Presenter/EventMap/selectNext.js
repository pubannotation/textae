import selectSelected from './selectSelected'

export default function(editorDom, selectionModel, shiftKey, getNextFunc) {
  const selectedSpans = selectSelected(editorDom, 'textae-editor__span')

  if (selectedSpans.length) {
    const nextElement = getNextFunc(selectedSpans, 'textae-editor__span')
    selectionModel.selectSpan(nextElement, shiftKey)
    return
  }

  const selectedTypeValues = selectSelected(
    editorDom,
    'textae-editor__type-values'
  )

  if (selectedTypeValues.length) {
    const nextElement = getNextFunc(
      selectedTypeValues,
      'textae-editor__type-values'
    )

    selectionModel.selectEntityLabel(nextElement, shiftKey)
    return
  }

  const selectedEntities = selectSelected(editorDom, 'textae-editor__entity')

  if (selectedEntities.length) {
    // return a select entity function
    const nextElement = getNextFunc(selectedEntities, 'textae-editor__entity')

    selectionModel.selectEntity(nextElement, shiftKey)
    return
  }
}
