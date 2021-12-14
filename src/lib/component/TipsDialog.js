import Dialog from './Dialog'

export default class TipsDialog extends Dialog {
  constructor() {
    super(
      'For security reason, the shortcut keys for cut/copy/paste are changed as follows:',
      `<table class="textae-editor__tips-dialog__table">
        <thead>
          <tr><th></th><th>before</th><th>after</th></tr>
        </thead>
        <tbody>
          <tr><td>cut</td><td>x</td><td>Ctrl-x</td></tr>
          <tr><td>copy</td><td>c</td><td>Ctrl-c</td></tr>
          <tr><td>paste</td><td>v</td><td>Ctrl-v</td></tr>
        </tbody>
      </table>
      `,

      {
        maxWidth: 785
      }
    )
  }
}
