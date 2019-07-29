import { EventEmitter } from 'events'
import CursorChanger from '../../util/CursorChanger'
import getAnnotationFromServer from './getAnnotationFromServer'
import getConfigurationFromServer from './getCofigurationFromServer'
import DialogParams from '../dialog/DialogParams'
import getLoadDialog from './getLoadDialog'
import getLoadConfDialog from './getLoadConfDialog'
import getSaveDialog from './getSaveDialog'
import getSaveConfDialog from './getSaveConfDialog'
import openAndSetParam from './openAndSetParam'

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
        confirmDiscardChangeMessage,
        setAnnotationDataSourceUrl,
        editor,
        hasAnythingToSave
      ),
      null,
      annotationDataSourceUrl,
      parameter
    )
  }
  const showAccessConf = function(hasAnythingToSave, parameter) {
    openAndSetParam(
      getLoadConfDialog(
        api,
        confirmDiscardChangeMessage,
        setConfigurationDataSourceUrl,
        editor,
        hasAnythingToSave
      ),
      null,
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
      getSaveDialog(api, editor),
      params,
      annotationDataSourceUrl,
      parameter
    )
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
      getSaveConfDialog(api, editor),
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
