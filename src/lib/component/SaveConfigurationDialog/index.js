import Dialog from '../Dialog'
import createContentHtml from './createContentHtml'
import jsonDiff from './jsonDiff'
import bind from './bind'

export default class extends Dialog {
  constructor(editor, url, originalData, editedData, saveConfiguration) {
    super(
      'Save Configurations',
      createContentHtml({
        filename: 'config.json',
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
