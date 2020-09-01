import delegate from 'delegate'
import createDownloadPath from '../createDownloadPath'
import makeDomEnabled from '../makeDomEnabled'

export default function(editor, element, data, closeDialog, saveAnnotation) {
  // Disabled the button to save to the URL when no URL.
  delegate(element, '[type="text"].url', 'input', (e) => {
    makeDomEnabled(e.target.nextElementSibling, e.target.value)
  })

  // Save to the URL.
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
    editor.eventEmitter.emit('textae.saveAnnotationDialog.download.click')
    closeDialog()
  })

  delegate(element, 'a.viewsource', 'click', () => {
    window.open(createDownloadPath(data), '_blank')
    editor.eventEmitter.emit('textae.saveAnnotationDialog.viewsource.click')
    closeDialog()
  })
}
