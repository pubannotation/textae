import Dialog from './Dialog'

export default class HelpDialog extends Dialog {
  constructor() {
    super(
      'Help (Keyboard short-cuts)',
      `<div class="textae-tool__key-help"></div>
       <ul>
         <li>
          cut
          <image
           class="textae-editor__help-dialog__icon"
           src="http://localhost:8000/src/lib/css/images/btn_cut_16.png">
          : Ctrl+x
        </li>
         <li>
          copy
          <image
           class="textae-editor__help-dialog__icon"
           src="http://localhost:8000/src/lib/css/images/btn_copy_16.png">
          : Ctrl+c
        </li>
         <li>
          paste
          <image
           class="textae-editor__help-dialog__icon"
           src="http://localhost:8000/src/lib/css/images/btn_paste_16.png">
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
