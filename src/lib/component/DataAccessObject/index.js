import {
  EventEmitter as EventEmitter
}
from 'events'
import CursorChanger from '../../util/CursorChanger'
import getAnnotationFromServer from './getAnnotationFromServer'
import DialogParams from '../dialog/DialogParams'
import getLoadDialog from './getLoadDialog'
import getLoadConfDialog from './getLoadConfDialog'
import getSaveDialog from './getSaveDialog'
import getSaveConfDialog from './getSaveConfDialog'
import jsonEditor from '../jsonEditor'

// A sub component to save and load data.
module.exports = function(editor, confirmDiscardChangeMessage) {
  // Store the url the annotation data is loaded from per editor.
  let dataSourceUrl = ''

  const setDataSourceUrl = (url) => {
      dataSourceUrl = url
    },
    api = new EventEmitter(),
    showAccess = function(hasAnythingToSave, parameter) {
      let params = new DialogParams(null, null, null, hasAnythingToSave, null)
      openAndSetParam(getLoadDialog(api, confirmDiscardChangeMessage, setDataSourceUrl, editor), params, dataSourceUrl, parameter)
    },
    showAccessConf = function(hasAnythingToSave, parameter) {
      let params = new DialogParams(null, null, null, null, hasAnythingToSave)
      openAndSetParam(getLoadConfDialog(api, confirmDiscardChangeMessage, setDataSourceUrl, editor), params, dataSourceUrl, parameter)
    },
    showSave = function(originalData, editedData, parameter) {
      let params = new DialogParams(editedData, originalData.config, editedData.config, null, null)
      openAndSetParam(getSaveDialog(api, confirmDiscardChangeMessage, setDataSourceUrl, editor), params, dataSourceUrl, parameter)
      // ADD JsonEditor
      // var $dialog = openAndSetParam(getSaveDialog(api, confirmDiscardChangeMessage, setDataSourceUrl, editor), jsonData, dataSourceUrl, params)
      // jsonEditor($dialog)
    },
    showSaveConf = function(originalData, editedData, parameter) {
      let params = new DialogParams(editedData, originalData.config, editedData.config, null, null)
      openAndSetParam(getSaveConfDialog(api, confirmDiscardChangeMessage, setDataSourceUrl, editor), params, dataSourceUrl, parameter)
    },
    cursorChanger = new CursorChanger(editor)

  Object.assign(api, {
    getAnnotationFromServer: (urlToJson) => getAnnotationFromServer(urlToJson, cursorChanger, api, setDataSourceUrl),
    showAccess,
    showSave,
    showAccessConf,
    showSaveConf
  })

  return api
}

function openAndSetParam($dialog, params, dataSourceUrl, parameter) {
  // If has the save_to parameter
  let url = dataSourceUrl;
  if (parameter.has('save_to')) {
    url = parameter.get('save_to');
  }

  // Display dataSourceUrl.
  $dialog.find('[type="text"].url')
    .val(url)
    .trigger('input')

  $dialog.params = params
  $dialog.open()

  return $dialog;
}

function extractConfigData(annotationData) {
  return JSON.stringify(JSON.parse(annotationData).config)
}

