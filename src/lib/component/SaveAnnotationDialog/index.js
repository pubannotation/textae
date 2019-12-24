import Dialog from '../Dialog'
import createContentHtml from './createContentHtml'
import bind from './bind'

export default class extends Dialog {
  constructor(editor, url, data) {
    super(
      'Save Annotations',
      createContentHtml({ filename: 'annotations.json', url }),
      {
        buttons: { Cancel: () => super.close() }
      }
    )

    bind(editor, super.el, data, () => super.close())
  }
}
