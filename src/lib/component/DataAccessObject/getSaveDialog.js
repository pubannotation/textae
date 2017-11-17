import CursorChanger from '../../util/CursorChanger'
import * as ajaxAccessor from '../../util/ajaxAccessor'
import getLoadDialog from './getLoadDialog'
import label from './label'
import jQuerySugar from '../jQuerySugar'
import getDialog from './getDialog'
import jsonDiff from '../../util/jsonDiff'
import $ from 'jquery'
import _ from 'underscore'

module.exports = function(api, confirmDiscardChangeMessage, setDataSourceUrl, editor) {
  var cursorChanger = new CursorChanger(editor),
    showSaveSuccess = function() {
      api.emit('save')
      cursorChanger.endWait()
    },
    showSaveError = function() {
      api.emit('save error')
      cursorChanger.endWait()
    },
    saveAnnotationToServer = function(url, jsonData) {
      cursorChanger.startWait()
      ajaxAccessor.post(url, jsonData, showSaveSuccess, showSaveError, function() {
        cursorChanger.endWait()
      })
    },
    createDownloadPath = function(contents) {
      var blob = new Blob([contents], {
        type: 'application/json'
      })
      return URL.createObjectURL(blob)
    },
    getAnnotationFilename = function() {
      var $fileInput = getLoadDialog(api, confirmDiscardChangeMessage, label, setDataSourceUrl, editor).find("input[type='file']"),
        file = $fileInput.prop('files')[0]

      return file ? file.name : 'annotations.json'
    },
    getConfigurationFilename = function() {
      var $fileInput = getLoadDialog(api, confirmDiscardChangeMessage, label, setDataSourceUrl, editor).find("input[type='file']"),
        file = $fileInput.prop('files')[0]

      return file ? file.name : 'config.json'
    },
    RowDiv = _.partial(jQuerySugar.Div, 'textae-editor__save-dialog__row'),
    RowLabel = _.partial(jQuerySugar.Label, 'textae-editor__save-dialog__label'),
    $annotationSaveButton = new jQuerySugar.Button('Save', 'url'),
    $configSaveButton = new jQuerySugar.Button('Save', 'url--config'),
    $annotationContent = $('<div>')
    .append(
      new RowDiv().append(
        new RowLabel(label.URL),
        $('<input type="text" class="textae-editor__save-dialog__server-file-name url" />'),
        $annotationSaveButton
      )
    )
    .on('input', 'input.url', function() {
      jQuerySugar.enabled($annotationSaveButton, this.value)
    })
    .on('click', '[type="button"].url', function() {
      saveAnnotationToServer(jQuerySugar.getValueFromText($annotationContent, 'url'), JSON.parse($dialog.params.editedAnnotation))
      closeDialog($content)
    })
    .append(
      new RowDiv().append(
        new RowLabel(label.LOCAL),
        $('<input type="text" class="textae-editor__save-dialog__local-file-name local">'),
        $('<a class="download" href="#">Download</a>')
      )
    )
    .on('click', 'a.download', function() {
      var downloadPath = createDownloadPath(JSON.stringify($dialog.params.editedAnnotation))
      $(this)
        .attr('href', downloadPath)
        .attr('download', jQuerySugar.getValueFromText($annotationContent, 'local'))
      api.emit('save')
      closeDialog($content)
    })
    .append(
      new RowDiv().append(
        new RowLabel(),
        $('<a class="viewsource" href="#">Click to see the json source in a new window.</a>')
      )
    )
    .on('click', 'a.viewsource', function(e) {
      var downloadPath = createDownloadPath(JSON.stringify($dialog.params.editedAnnotation))
      window.open(downloadPath, '_blank')
      api.emit('save')
      closeDialog($content)
      return false
    }),
    // Add JsonEditor
    // .append(
    //   new RowDiv().append(
    //     $('<div id="editor_holder"></div> ')
    //   )
    // )

    $configurationContent = $('<div>')
    .append(
        new RowDiv().append(
          _.partial(jQuerySugar.P, 'textae-editor__save-dialog__config-title', '...or save configurations')
        )
      )
      .append(
        new RowDiv().append(
          new RowLabel(label.URL),
          $('<input type="text" class="textae-editor__save-dialog__server-file-name--config url--config" />'),
          $configSaveButton
        )
      )
      .on('input', 'input.url--config', function() {
        jQuerySugar.enabled($configSaveButton, this.value)
      })
      .on('click', '[type="button"].url--config', function() {
        // saveConfigurationsToServer(jQuerySugar.getValueFromText($content, 'url--config'), JSON.parse($dialog.params.editedConfig))
        // closeDialog($content)
      })
      .append(
        new RowDiv().append(
          new RowLabel(label.LOCAL),
          $('<input type="text" class="textae-editor__save-dialog__local-file-name--config local--config">'),
          $('<a class="download--config" href="#">Download</a>')
        )
      )
      .on('click', 'a.download--config', function() {
        let downloadPath = createDownloadPath(JSON.stringify($dialog.params.editedConfig))
        $(this)
          .attr('href', downloadPath)
          .attr('download', jQuerySugar.getValueFromText($annotationContent, 'local--config'))
        api.emit('save')
        closeDialog($content)
      }),
    $diffViewer = $('<div class="textae-editor__save-dialog__diff-viewer">'),
    $content = $annotationContent.append($configurationContent).append($diffViewer)

  var $dialog = getDialog('textae.dialog.save', 'Save Annotations', $content[0], editor)

  // Set the filename when the dialog is opened.
  $dialog.on('dialogopen', function() {
    let diff = jsonDiff($dialog.params.originalConfig, $dialog.params.editedConfig)
    $dialog.find('[type="text"].local').val(getAnnotationFilename())
    $dialog.find('[type="text"].local--config').val(getConfigurationFilename())
    $dialog.find('.textae-editor__save-dialog__diff-viewer').html(diff || 'nothing.')
  })

  return $dialog
}

function closeDialog($content) {
  $content.trigger('dialog.close')
}
