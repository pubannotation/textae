import jQuerySugar from '../jQuerySugar'
import getJsonFromFile from './getJsonFromFile'
import label from './label'
import getConfigurationFromServer from './getCofigurationFromServer'
import CursorChanger from '../../util/CursorChanger'
import getDialog from './getDialog'
import $ from 'jquery'
import _ from 'underscore'

module.exports = function(
  api,
  confirmDiscardChangeMessage,
  setDataSourceUrl,
  editor
) {
  const RowDiv = _.partial(jQuerySugar.Div, 'textae-editor__load-dialog__row')
  const RowLabel = _.partial(
    jQuerySugar.Label,
    'textae-editor__load-dialog__label'
  )
  const OpenButton = _.partial(jQuerySugar.Button, 'Open')
  const isUserConfirm = function() {
    return (
      !$dialog.params.hasAnythingToSaveConfiguration ||
      window.confirm(confirmDiscardChangeMessage)
    )
  }
  const $configButtonUrl = new OpenButton('url--config')
  const $configButtonLocal = new OpenButton('local--config')
  const $content = $('<div>')
    .append(
      new RowDiv().append(
        new RowLabel(label.URL),
        $(
          '<input type="text" class="textae-editor__load-dialog__file-name--config url--config" />'
        ),
        $configButtonUrl
      )
    )
    .on('input', 'input.url--config', function() {
      jQuerySugar.enabled($configButtonUrl, this.value)
    })
    .on('click', '[type="button"].url--config', () => {
      if (isUserConfirm()) {
        getConfigurationFromServer(
          jQuerySugar.getValueFromText($content, 'url--config'),
          new CursorChanger(editor),
          api,
          setDataSourceUrl
        )
      }
      closeDialog($content)
    })
    .append(
      new RowDiv().append(
        new RowLabel(label.LOCAL),
        $(
          '<input class="textae-editor__load-dialog__file--config" type="file" />'
        ),
        $configButtonLocal
      )
    )
    .on('change', '.textae-editor__load-dialog__file--config', function() {
      jQuerySugar.enabled($configButtonLocal, this.files.length > 0)
    })
    .on('click', '[type="button"].local--config', () => {
      if (isUserConfirm()) {
        getJsonFromFile(
          api,
          $content.find('.textae-editor__load-dialog__file--config')[0],
          'config'
        )
      }
      closeDialog($content)
    })

  // Capture the local variable by inner funcitons.
  const $dialog = getDialog(
    'textae.dialog.load',
    'Load Configurations',
    $content[0],
    editor
  )

  return $dialog
}

function closeDialog($content) {
  $content.trigger('dialog.close')
}
