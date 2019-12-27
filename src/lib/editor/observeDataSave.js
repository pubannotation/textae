import toastr from 'toastr'

export default function(editor, history) {
  editor.eventEmitter
    .on('textae.dataAccessObject.annotation.save', () => {
      history.annotatioSaved()
      toastr.success('annotation saved')
    })
    .on('textae.dataAccessObject.configuration.save', () => {
      history.configurationSaved()
      toastr.success('configuration saved')
    })
    .on('textae.dataAccessObject.saveError', () => {
      toastr.error('could not save')
    })
}
