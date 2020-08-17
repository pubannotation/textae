import getRightElement from '../../../getRightElement'
import selectNextFunc from '../selectNextFunc'

export default function(editorDom, selectionModel, shiftKey) {
  const getNextFunc = (selected, className) =>
    getRightElement(editorDom, selected[selected.length - 1], className)

  return selectNextFunc(editorDom, selectionModel, shiftKey, getNextFunc)
}
