import EditorDialog from '../../../../../dialog/EditorDialog'

export default function getDialog($content) {
  return new EditorDialog(
    'textae.dialog.login-info',
    'Login is required',
    $content,
    {
      noCancelButton: true
    }
  )
}
