import makeDomEnabled from '../makeDomEnabled'
import updateLineHeight from './updateLineHeight';

export default function(dialog, editorDom, typeDefinition, displayInstance) {
  makeDomEnabled(
    dialog.querySelector('.type-gap'),
    displayInstance.showInstance()
  )
  dialog.querySelector('.type-gap').value = displayInstance.getTypeGap()
  dialog.querySelector('.lock-config').checked = typeDefinition.isLock()

  updateLineHeight(editorDom, dialog)
}
