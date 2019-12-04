import toastr from 'toastr'

export default function(editor, history) {
  editor.eventEmitter
    .on('texta.dataAccessObject.annotation.save', () => {
      history.annotatioSaved()
      toastr.success('annotation saved')
    })
    .on('texta.dataAccessObject.configuration.save', () => {
      history.configurationSaved()
      toastr.success('configuration saved')
    })
    .on('texta.dataAccessObject.saveError', () => {
      toastr.error('could not save')
    })
}
