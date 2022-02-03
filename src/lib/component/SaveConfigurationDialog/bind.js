import delegate from 'delegate'
import createDownloadPath from '../createDownloadPath'
import enableHTMLElement from '../enableHTMLElement'

export default function (
  eventEmitter,
  element,
  editedData,
  closeDialog,
  saveConfiguration
) {
  // Disabled the button to save to the URL when no URL.
  delegate(element, '.textae-editor__save-dialog__url-text', 'input', (e) => {
    enableHTMLElement(e.target.nextElementSibling, e.target.value)
  })

  // Save to the URL.
  delegate(element, '.textae-editor__save-dialog__url-text', 'keyup', (e) => {
    if (e.keyCode === 13) {
      saveConfiguration(e.target.value)
      closeDialog()
    }
  })
  delegate(element, '.textae-editor__save-dialog__url-button', 'click', (e) => {
    saveConfiguration(e.target.previousElementSibling.value)
    closeDialog()
  })

  // Download as a JSON file.
  delegate(
    element,
    '.textae-editor__save-dialog__download-link',
    'click',
    (e) => {
      const aTag = e.target
      const downloadPath = createDownloadPath(editedData)
      aTag.setAttribute('href', downloadPath)
      aTag.setAttribute('download', aTag.previousElementSibling.value)
      eventEmitter.emit('textae-event.resource.configuration.save', editedData)
      closeDialog()
    }
  )
}
