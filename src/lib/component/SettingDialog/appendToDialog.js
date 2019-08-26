import EditorDialog from '../dialog/EditorDialog'

export default function(content, okHandler) {
  return new EditorDialog('textae.dialog.setting', 'Setting', content, {
    noCancelButton: true,
    buttons: {
      OK: okHandler
    }
  })
}
