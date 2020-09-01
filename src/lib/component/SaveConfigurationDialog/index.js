import Dialog from '../Dialog'
import createContentHtml from './createContentHtml'
import jsonDiff from './jsonDiff'
import bind from './bind'

export default class extends Dialog {
  constructor(
    editor,
    url,
    filename,
    originalData,
    editedData,
    saveConfiguration
  ) {
    super(
      'Save Configurations',
      createContentHtml({
        filename,
        url,
        diff: jsonDiff(originalData, editedData) || 'nothing.'
      }),
      {
        label: 'Cancel'
      }
    )

    bind(editor, super.el, editedData, () => super.close(), saveConfiguration)
  }
}
