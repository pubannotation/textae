import { formatters } from 'jsondiffpatch'
import Dialog from '../Dialog'
import createContentHtml from './createContentHtml'
import jsonDiff from './jsonDiff'
import bind from './bind'

export default class SaveConfigurationDialog extends Dialog {
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
      'Cancel',
      {
        width: 550
      }
    )

    // Hide unchanged diff.
    this._$dialog.on('dialogopen', () => formatters.html.hideUnchanged())

    bind(editor, super.el, editedData, () => super.close(), saveConfiguration)
  }
}
