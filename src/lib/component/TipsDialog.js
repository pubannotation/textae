import Dialog from './Dialog'

export default class TipsDialog extends Dialog {
  constructor() {
    super(
      'Tips for Keyboard short-cuts about copy and paste.',
      `<div >
        <span>For security reason, the shortcut keys for cut/copy/paste are changed as follows:</span>
        <table>
          <tr><th></th><th>before</th><th>after</th></tr>
          <tr><td>cut</td><td>x</td><td>Ctrl-x</td></tr>
          <tr><td>copy</td><td>c</td><td>Ctrl-c</td></tr>
          <tr><td>paste</td><td>v</td><td>Ctrl-v</td></tr>
        </table>
      </div>`,

      {
        height: 313,
        maxWidth: 523
      }
    )
  }
}
