import delegate from 'delegate'
import createDownloadPath from './createDownloadPath'

export default function(el, editedData, api, closeDialog) {
  el.insertAdjacentHTML(
    'beforeend',
    `
    <div class="textae-editor__save-dialog__row">
      <label class="textae-editor__save-dialog__label"></label>
      <a class="viewsource" href="#">Click to see the json source in a new window.</a>
    </div>
    `
  )
  delegate(el, 'a.viewsource', 'click', () => {
    window.open(createDownloadPath(JSON.stringify(editedData)), '_blank')
    api.emit('annotation.save')
    closeDialog()
  })
}
