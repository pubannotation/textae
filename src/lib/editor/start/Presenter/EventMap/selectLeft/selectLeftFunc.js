import getLeftElement from '../../../getLeftElement'
import selectNextFunc from '../selectNextFunc'

export default function(editorDom, selectionModel, shiftKey) {
  const getNextFunc = (selected, className) =>
    getLeftElement(editorDom, selected[0], className)

  return selectNextFunc(editorDom, selectionModel, shiftKey, getNextFunc)
}
