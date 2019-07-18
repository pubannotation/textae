import selectRightFunc from "./selectRightFunc"

export default function selectRight(editorDom, selectionModel, shiftKey) {
  const selectNext = selectRightFunc(editorDom, selectionModel, shiftKey)
  selectNext()
}
