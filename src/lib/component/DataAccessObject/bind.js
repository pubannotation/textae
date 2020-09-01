import save from './save'

export default function bind(editor, ajaxSender) {
  const emitter = editor.eventEmitter

  emitter
    .on('textae.saveAnnotationDialog.url.click', (url, data) =>
      save(editor, ajaxSender, url, data)
    )
    .on('textae.saveAnnotationDialog.download.click', () =>
      emitter.emit('textae.annotation.save')
    )
    .on('textae.saveAnnotationDialog.viewsource.click', () =>
      emitter.emit('textae.annotation.save')
    )
    .on('textae.saveConfigurationDialog.url.click', (url, data) => {
      // textae-config service is build with the Ruby on Rails 4.X.
      // To change existing files, only PATCH method is allowed on the Ruby on Rails 4.X.
      ajaxSender.patch(url, data, () =>
        emitter.emit('textae.configuration.save')
      )
    })
    .on('textae.saveConfigurationDialog.download.click', () =>
      emitter.emit('textae.configuration.save')
    )
}
