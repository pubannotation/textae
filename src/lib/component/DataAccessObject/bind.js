export default function bind(editor, ajaxSender) {
  const emitter = editor.eventEmitter

  emitter
    .on('textae.saveAnnotationDialog.url.click', (url, data) =>
      ajaxSender.post(url, data, () =>
        emitter.emit('textae.dataAccessObject.annotation.save')
      )
    )
    .on('textae.saveAnnotationDialog.download.click', () =>
      emitter.emit('textae.dataAccessObject.annotation.save')
    )
    .on('textae.saveAnnotationDialog.viewsource.click', () =>
      emitter.emit('textae.dataAccessObject.annotation.save')
    )
    .on('textae.saveConfigurationDialog.url.click', (url, data) => {
      // textae-config service is build with the Ruby on Rails 4.X.
      // To change existing files, only PATCH method is allowed on the Ruby on Rails 4.X.
      ajaxSender.patch(url, data, () =>
        emitter.emit('textae.dataAccessObject.configuration.save')
      )
    })
    .on('textae.saveConfigurationDialog.download.click', () =>
      emitter.emit('textae.dataAccessObject.configuration.save')
    )
}
