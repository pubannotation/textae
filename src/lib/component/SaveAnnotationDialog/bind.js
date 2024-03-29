import delegate from 'delegate'
import createDownloadPath from '../createDownloadPath'
import enableHTMLElement from '../enableHTMLElement'

export default function (
  eventEmitter,
  element,
  data,
  closeDialog,
  saveAnnotation
) {
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
  delegate(element, '.textae-editor__save-dialog__url-button', 'click', (e) => {
    saveAnnotation(e.target.previousElementSibling.value)
    closeDialog()
  })

  // Download as a JSON file.
  delegate(
    element,
    '.textae-editor__save-dialog__download-link',
    'click',
    (e) => {
      const aTag = e.target
      const downloadPath = createDownloadPath(data)
      aTag.setAttribute('href', downloadPath)
      aTag.setAttribute('download', aTag.previousElementSibling.value)
      eventEmitter.emit('textae-event.resource.annotation.save', data)
      closeDialog()
    }
  )

  delegate(
    element,
    '.textae-editor__save-dialog__viewsource-link',
    'click',
    () => {
      window.open(createDownloadPath(data), '_blank')
      eventEmitter.emit('textae-event.resource.annotation.save', data)
      closeDialog()
    }
  )
}
