import { getLeftElement } from '../../../getNextElement'
import selectNextFunc from '../selectNextFunc'

export default function(editorDom, selectionModel, shiftKey) {
  const getNextFunc = (selected) => getLeftElement(editorDom, selected[0])

  return selectNextFunc(editorDom, selectionModel, shiftKey, getNextFunc)
}
