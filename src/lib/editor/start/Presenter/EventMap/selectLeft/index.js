import selectLeftFunc from './selectLeftFunc'

export default function(editorDom, selectionModel, shiftKey) {
  const selectNext = selectLeftFunc(editorDom, selectionModel, shiftKey)
  selectNext()
}
