import Dialog from './Dialog'

export default class HelpDialog extends Dialog {
  constructor() {
    super(
      'Help (Keyboard short-cuts)',
      `<div class="textae-tool__key-help"></div>
       <ul>
         <li>
          cut
          : Ctrl+x
        </li>
         <li>
          copy
          : Ctrl+c
        </li>
         <li>
          paste
          : Ctrl+v
        </li>
       </ul>
      `,

      {
        maxWidth: 523
      }
    )
  }
}
