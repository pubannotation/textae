import alertifyjs from 'alertifyjs'

export default function(editor, history) {
  editor.eventEmitter
    .on('textae.dataAccessObject.annotation.save', () => {
      history.annotatioSaved()
      alertifyjs.success('annotation saved')
    })
    .on('textae.dataAccessObject.configuration.save', () => {
      history.configurationSaved()
      alertifyjs.success('configuration saved')
    })
    .on('textae.dataAccessObject.saveError', () => {
      alertifyjs.error('could not save')
    })
}
