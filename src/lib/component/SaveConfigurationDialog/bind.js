import delegate from 'delegate'
import createDownloadPath from '../createDownloadPath'
import makeDomEnabled from '../makeDomEnabled'

export default function(
  editor,
  element,
  editedData,
  dialogClose,
  saveConfiguration
) {
  // Disabled the button to save to the URL when no URL.
  delegate(element, '[type="text"].url', 'input', (e) => {
    makeDomEnabled(e.target.nextElementSibling, e.target.value)
  })

  // Save to the URL.
  delegate(element, '[type="button"].url', 'click', (e) => {
    saveConfiguration(e.target.previousElementSibling.value)
    dialogClose()
  })

  // Download as a JSON file.
  delegate(element, 'a.download', 'click', (e) => {
    const aTag = e.target
    const downloadPath = createDownloadPath(editedData)
    aTag.setAttribute('href', downloadPath)
    aTag.setAttribute('download', aTag.previousElementSibling.value)
    editor.eventEmitter.emit('textae.saveConfigurationDialog.download.click')
    dialogClose()
  })
}
