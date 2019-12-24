import delegate from 'delegate'
import createDownloadPath from '../DataAccessObject/createDownloadPath'
import makeDomEnabled from '../makeDomEnabled'

export default function(editor, element, editedData, dialogClose) {
  // Disabled the button to save to the URL when no URL.
  delegate(element, '[type="text"].url', 'input', (e) => {
    makeDomEnabled(e.target.nextElementSibling, e.target.value)
  })

  // Save to the URL.
  delegate(element, '[type="button"].url', 'click', (e) => {
    editor.eventEmitter.emit(
      'textae.saveConfigurationDialog.url.click',
      e.target.previousElementSibling.value,
      JSON.stringify(editedData)
    )
    dialogClose()
  })

  // Download as a JSON file.
  delegate(element, 'a.download', 'click', (e) => {
    const aTag = e.target
    const downloadPath = createDownloadPath(JSON.stringify(editedData))
    aTag.setAttribute('href', downloadPath)
    aTag.setAttribute('download', aTag.previousElementSibling.value)
    editor.eventEmitter.emit('textae.saveConfigurationDialog.download.click')
    dialogClose()
  })
}
