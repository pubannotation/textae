import getLineHeight from '../../editor/start/View/lineHeight/getLineHeight'

export default function(editorDom, dialog) {
  dialog.querySelector('.line-height').value = getLineHeight(editorDom)
}
