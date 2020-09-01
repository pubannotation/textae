import Dialog from '../Dialog'
import createContentHtml from './createContentHtml'
import bind from './bind'

export default class extends Dialog {
  constructor(editor, url, filename, data, saveAnnotation) {
    super('Save Annotations', createContentHtml({ filename, url }), {
      label: 'Cancel'
    })

    bind(editor, super.el, data, () => super.close(), saveAnnotation)
  }
}
