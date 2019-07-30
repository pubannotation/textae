import { EventEmitter } from 'events'
import CursorChanger from '../../util/CursorChanger'
import getAnnotationFromServer from './getAnnotationFromServer'
import getConfigurationFromServer from './getCofigurationFromServer'
import getLoadDialog from './getLoadDialog'
import getSaveDialog from './getSaveDialog'
import getJsonFromFile from './getJsonFromFile'
import saveJsonToServer from './saveJsonToServer'
import saveConfigJsonToServer from './saveConfigJsonToServer'
import jQuerySugar from '../jQuerySugar'
import createDownloadPath from './createDownloadPath'
import closeDialog from './closeDialog'
import $ from 'jquery'
import jsonDiff from '../../util/jsonDiff'
import overwriteUrl from './overwriteUrl'

// A sub component to save and load data.
export default function(editor, confirmDiscardChangeMessage) {
  // Store the url the annotation data is loaded from per editor.
  const urlOfLastRead = {
    annotation: '',
    config: ''
  }

  const setAnnotationDataSourceUrl = (url) => {
    urlOfLastRead.annotation = url
  }
  const setConfigurationDataSourceUrl = (url) => {
    urlOfLastRead.config = url
  }
  const api = new EventEmitter()
  const cursorChanger = new CursorChanger(editor)
  const showAccess = function(hasAnythingToSave) {
    getLoadDialog(
      api,
      setAnnotationDataSourceUrl,
      cursorChanger,
      () => {
        return !hasAnythingToSave || window.confirm(confirmDiscardChangeMessage)
      },
      getAnnotationFromServer,
      (api, file) => getJsonFromFile(api, file, 'annotation'),
      'Load Annotations',
      urlOfLastRead.annotation
    ).open()
  }
  const showAccessConf = function(hasAnythingToSave) {
    getLoadDialog(
      api,
      setConfigurationDataSourceUrl,
      cursorChanger,
      () => {
        return !hasAnythingToSave || window.confirm(confirmDiscardChangeMessage)
      },
      getConfigurationFromServer,
      (api, file) => getJsonFromFile(api, file, 'config'),
      'Load Configurations',
      urlOfLastRead.config
    ).open()
  }
  const showSave = function(editedData, parameter) {
    getSaveDialog(
      api,
      cursorChanger,
      (url, jsonData, showSaveSuccess, showSaveError) =>
        saveJsonToServer(
          url,
          jsonData,
          showSaveSuccess,
          showSaveError,
          cursorChanger,
          editor
        ),
      () => api.emit('save'),
      editedData,
      'annotations.json',
      'Save Annotations',
      ($dialog) => {
        $dialog
          .append(
            new jQuerySugar.Div('textae-editor__save-dialog__row').append(
              jQuerySugar.Label('textae-editor__save-dialog__label'),
              $(
                '<a class="viewsource" href="#">Click to see the json source in a new window.</a>'
              )
            )
          )
          .on('click', 'a.viewsource', () => {
            const downloadPath = createDownloadPath(JSON.stringify(editedData))
            window.open(downloadPath, '_blank')
            api.emit('save')
            closeDialog($dialog)
            return false
          })
      },
      overwriteUrl(urlOfLastRead.annotation, parameter)
    ).open()
  }
  const showSaveConf = function(originalData, editedData, parameter) {
    getSaveDialog(
      api,
      cursorChanger,
      (url, jsonData, showSaveSuccess, showSaveError) =>
        saveConfigJsonToServer(
          url,
          jsonData,
          showSaveSuccess,
          showSaveError,
          cursorChanger,
          editor
        ),
      () => api.emit('save--config'),
      editedData.config,
      'config.json',
      'Save Configurations',
      ($dialog) => {
        $dialog
          .append(
            new jQuerySugar.Div('textae-editor__save-dialog__row').append(
              $('<p class="textae-editor__save-dialog__diff-title">')
                .text('Configuration differences')
                .append(
                  $('<span class="diff-info diff-info--add">added</span>')
                )
                .append(
                  $('<span class="diff-info diff-info--remove">removed</span>')
                )
            )
          )
          .append(
            $(
              `<div class="textae-editor__save-dialog__diff-viewer">${jsonDiff(
                originalData.config,
                editedData.config
              ) || 'nothing.'}</div>`
            )
          )
      },
      overwriteUrl(urlOfLastRead.config, parameter)
    ).open()
  }

  Object.assign(api, {
    getAnnotationFromServer: (urlToJson) =>
      getAnnotationFromServer(
        urlToJson,
        cursorChanger,
        api,
        setAnnotationDataSourceUrl
      ),
    getConfigurationFromServer: (urlToJson) =>
      getConfigurationFromServer(
        urlToJson,
        cursorChanger,
        api,
        setConfigurationDataSourceUrl
      ),
    showAccess,
    showSave,
    showAccessConf,
    showSaveConf
  })

  return api
}
