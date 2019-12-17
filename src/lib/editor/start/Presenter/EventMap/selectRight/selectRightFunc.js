import { getRightElement } from '../../../getNextElement'
import selectNextFunc from '../selectNextFunc'

export default function(editorDom, selectionModel, shiftKey) {
  const getNextFunc = (selected) =>
    getRightElement(editorDom, selected[selected.length - 1])
  return selectNextFunc(editorDom, selectionModel, shiftKey, getNextFunc)
}
