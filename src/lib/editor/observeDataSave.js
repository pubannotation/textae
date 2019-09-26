import toastr from 'toastr'

export default function(dataAccessObject, history) {
  dataAccessObject
    .on('annotation.save', () => {
      history.annotatioSaved()
      toastr.success('annotation saved')
    })
    .on('configuration.save', () => {
      history.configurationSaved()
      toastr.success('configuration saved')
    })
    .on('save error', () => {
      toastr.error('could not save')
    })
}
