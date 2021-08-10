import delegate from 'delegate'
import createDownloadPath from '../createDownloadPath'
import enableHTMLElement from '../enableHTMLElement'

export default function (editor, element, data, closeDialog, saveAnnotation) {
  // Disabled the button to save to the URL when no URL.
  delegate(element, '.textae-editor__save-dialog__url-text', 'input', (e) => {
    enableHTMLElement(e.target.nextElementSibling, e.target.value)
  })

  // Save to the URL.
  delegate(element, '.textae-editor__save-dialog__url-text', 'keyup', (e) => {
    if (e.keyCode === 13) {
      saveAnnotation(e.target.value)
      closeDialog()
    }
  })
  delegate(element, '[type="button"].url', 'click', (e) => {
    saveAnnotation(e.target.previousElementSibling.value)
    closeDialog()
  })

  // Download as a JSON file.
  delegate(element, 'a.download', 'click', (e) => {
    const aTag = e.target
    const downloadPath = createDownloadPath(data)
    aTag.setAttribute('href', downloadPath)
    aTag.setAttribute('download', aTag.previousElementSibling.value)
    editor.eventEmitter.emit(
      'textae-event.save-annotation-dialog.download.click'
    )
    closeDialog()
  })

  delegate(element, 'a.viewsource', 'click', () => {
    window.open(createDownloadPath(data), '_blank')
    editor.eventEmitter.emit(
      'textae-event.save-annotation-dialog.viewsource.click'
    )
    closeDialog()
  })
}
