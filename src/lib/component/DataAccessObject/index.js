import {
  EventEmitter as EventEmitter
}
from 'events'
import CursorChanger from '../../util/CursorChanger'
import getAnnotationFromServer from './getAnnotationFromServer'
import getLoadDialog from './getLoadDialog'
import getSaveDialog from './getSaveDialog'

// A sub component to save and load data.
module.exports = function(editor, confirmDiscardChangeMessage) {
  // Store the url the annotation data is loaded from per editor.
  let dataSourceUrl = ''

  const setDataSourceUrl = (url) => {
      dataSourceUrl = url
    },
    api = new EventEmitter(),
    showAccess = function(hasAnythingToSave) {
      openAndSetParam(getLoadDialog(api, confirmDiscardChangeMessage, setDataSourceUrl, editor), hasAnythingToSave, dataSourceUrl)
    },
    showSave = function(jsonData, params) {
      openAndSetParam(getSaveDialog(api, confirmDiscardChangeMessage, setDataSourceUrl, editor), jsonData, dataSourceUrl, params)
    },
    cursorChanger = new CursorChanger(editor)

  Object.assign(api, {
    getAnnotationFromServer: (urlToJson) => getAnnotationFromServer(urlToJson, cursorChanger, api, setDataSourceUrl),
    showAccess,
    showSave,
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
}
