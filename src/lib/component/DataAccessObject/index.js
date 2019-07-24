import { EventEmitter } from 'events'
import CursorChanger from '../../util/CursorChanger'
import getAnnotationFromServer from './getAnnotationFromServer'
import getConfigurationFromServer from './getCofigurationFromServer'
import DialogParams from '../dialog/DialogParams'
import getLoadDialog from './getLoadDialog'
import getLoadConfDialog from './getLoadConfDialog'
import getSaveDialog from './getSaveDialog'
import getSaveConfDialog from './getSaveConfDialog'

// A sub component to save and load data.
module.exports = function(editor, confirmDiscardChangeMessage) {
  // Store the url the annotation data is loaded from per editor.
  let annotationDataSourceUrl = ''
  let configurationDataSourceUrl = ''

  const setAnnotationDataSourceUrl = (url) => {
    annotationDataSourceUrl = url
  }
  const setConfigurationDataSourceUrl = (url) => {
    configurationDataSourceUrl = url
  }
  const api = new EventEmitter()
  const showAccess = function(hasAnythingToSave, parameter) {
    const params = new DialogParams(null, null, null, hasAnythingToSave, null)
    openAndSetParam(
      getLoadDialog(
        api,
        confirmDiscardChangeMessage,
        setAnnotationDataSourceUrl,
        editor
      ),
      params,
      annotationDataSourceUrl,
      parameter
    )
  }
  const showAccessConf = function(hasAnythingToSave, parameter) {
    const params = new DialogParams(null, null, null, null, hasAnythingToSave)
    openAndSetParam(
      getLoadConfDialog(
        api,
        confirmDiscardChangeMessage,
        setConfigurationDataSourceUrl,
        editor
      ),
      params,
      configurationDataSourceUrl,
      parameter
    )
  }
  const showSave = function(originalData, editedData, parameter) {
    const params = new DialogParams(
      editedData,
      originalData.config,
      editedData.config,
      null,
      null
    )
    openAndSetParam(
      getSaveDialog(
        api,
        confirmDiscardChangeMessage,
        setAnnotationDataSourceUrl,
        editor
      ),
      params,
      annotationDataSourceUrl,
      parameter
    )
    // ADD JsonEditor
    // var $dialog = openAndSetParam(getSaveDialog(api, confirmDiscardChangeMessage, setDataSourceUrl, editor), jsonData, dataSourceUrl, params)
    // jsonEditor($dialog)
  }
  const showSaveConf = function(originalData, editedData, parameter) {
    const params = new DialogParams(
      editedData,
      originalData.config,
      editedData.config,
      null,
      null
    )
    openAndSetParam(
      getSaveConfDialog(
        api,
        confirmDiscardChangeMessage,
        setConfigurationDataSourceUrl,
        editor
      ),
      params,
      configurationDataSourceUrl,
      parameter
    )
  }
  const cursorChanger = new CursorChanger(editor)

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

function openAndSetParam($dialog, params, dataSourceUrl, parameter) {
  // If has the save_to parameter
  let url = dataSourceUrl
  if (parameter.has('save_to')) {
    url = parameter.get('save_to')
  }

  // Display dataSourceUrl.
  $dialog
    .find('[type="text"].url')
    .val(url)
    .trigger('input')
  $dialog
    .find('[type="text"].url--config')
    .val(url)
    .trigger('input')

  $dialog.params = params
  $dialog.open()

  return $dialog
}

function extractConfigData(annotationData) {
  return JSON.stringify(JSON.parse(annotationData).config)
}
