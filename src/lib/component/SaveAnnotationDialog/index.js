import Dialog from '../Dialog'
import createContentHtml from './createContentHtml'
import bind from './bind'

export default class SaveAnnotationDialog extends Dialog {
  constructor(editor, url, filename, data, saveAnnotation) {
    super('Save Annotations', createContentHtml({ filename, url }), 'Cancel')

    bind(editor, super.el, data, () => super.close(), saveAnnotation)
  }
}
