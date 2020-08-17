import getRightElement from '../../getRightElement'
import selectNext from './selectNext'

export default function selectRight(editorDom, selectionModel, shiftKey) {
  const getNextFunc = (selected, className) =>
    getRightElement(editorDom, selected[selected.length - 1], className)

  selectNext(editorDom, selectionModel, shiftKey, getNextFunc)
}
