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
    showSave = function(jsonData) {
      openAndSetParam(getSaveDialog(api, confirmDiscardChangeMessage, setDataSourceUrl, editor), jsonData, dataSourceUrl)
    },
    cursorChanger = new CursorChanger(editor)

  Object.assign(api, {
    getAnnotationFromServer: (urlToJson) => getAnnotationFromServer(urlToJson, cursorChanger, api, setDataSourceUrl),
    showAccess,
    showSave,
  })

  return api
}

function openAndSetParam($dialog, params, dataSourceUrl) {
  // Display dataSourceUrl.
  $dialog.find('[type="text"].url')
    .val(dataSourceUrl)
    .trigger('input')

  $dialog.params = params
  $dialog.open()
}
