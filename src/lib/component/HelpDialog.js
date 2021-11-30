import Dialog from './Dialog'

export default class HelpDialog extends Dialog {
  constructor() {
    super(
      'Help (Keyboard short-cuts)',
      '<div class="textae-tool__key-help"></div>',

      {
        height: 313,
        maxWidth: 523
      }
    )
  }
}
