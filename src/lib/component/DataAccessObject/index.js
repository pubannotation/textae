import { EventEmitter } from 'events'
import CursorChanger from '../../util/CursorChanger'
import getAnnotationFromServer from './getAnnotationFromServer'
import getConfigurationFromServer from './getCofigurationFromServer'
import DialogParams from '../dialog/DialogParams'
import getLoadDialog from './getLoadDialog'
import getSaveDialog from './getSaveDialog'
import getSaveConfDialog from './getSaveConfDialog'
import openAndSetParam from './openAndSetParam'
import getJsonFromFile from './getJsonFromFile'
import saveJsonToServer from './saveJsonToServer'
import saveConfigJsonToServer from './saveConfigJsonToServer'

// A sub component to save and load data.
export default function(editor, confirmDiscardChangeMessage) {
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
    openAndSetParam(
      getLoadDialog(
        api,
        setAnnotationDataSourceUrl,
        editor,
        () => {
          return (
            !hasAnythingToSave || window.confirm(confirmDiscardChangeMessage)
          )
        },
        getAnnotationFromServer,
        (api, file) => getJsonFromFile(api, file, 'annotation'),
        'Load Annotations'
      ),
      null,
      annotationDataSourceUrl,
      parameter
    )
  }
  const showAccessConf = function(hasAnythingToSave, parameter) {
    openAndSetParam(
      getLoadDialog(
        api,
        setConfigurationDataSourceUrl,
        editor,
        () => {
          return (
            !hasAnythingToSave || window.confirm(confirmDiscardChangeMessage)
          )
        },
        getConfigurationFromServer,
        (api, file) => getJsonFromFile(api, file, 'config'),
        'Load Configurations'
      ),
      null,
      configurationDataSourceUrl,
      parameter
    )
  }
  const showSave = function(originalData, editedData, parameter) {
    const params = new DialogParams(null, originalData.config, null, null, null)
    openAndSetParam(
      getSaveDialog(
        api,
        editor,
        saveJsonToServer,
        () => api.emit('save'),
        editedData,
        'annotations.json',
        'Save Annotations'
      ),
      params,
      annotationDataSourceUrl,
      parameter
    )
  }
  const showSaveConf = function(originalData, editedData, parameter) {
    const params = new DialogParams(null, originalData.config, null, null, null)
    openAndSetParam(
      getSaveConfDialog(
        api,
        editor,
        saveConfigJsonToServer,
        () => api.emit('save--config'),
        editedData.config,
        'config.json',
        'Save Configurations'
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
