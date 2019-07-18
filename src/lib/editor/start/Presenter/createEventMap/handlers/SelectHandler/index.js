import selectLeft from './selectLeft'
import selectRight from './selectRight'
import selectUpperLayer from './selectUpperLayer'
import selectLowerLayer from './selectLowerLayer'

export default function(editorDom, selectionModel) {
  return {
    selectLeft(option) {
      selectLeft(editorDom, selectionModel, option.shiftKey)
    },
    selectRight(option = {}) {
      selectRight(editorDom, selectionModel, option.shiftKey)
    },
    selectUp() {
      selectUpperLayer(editorDom, selectionModel)
    },
    selectDown() {
      selectLowerLayer(editorDom, selectionModel)
    }
  }
}
