import getLeftElement from '../../getLeftElement'
import selectNext from './selectNext'

export default function(editorDom, selectionModel, shiftKey) {
  const getNextFunc = (selected, className) =>
    getLeftElement(editorDom, selected[0], className)

  selectNext(editorDom, selectionModel, shiftKey, getNextFunc)
}
