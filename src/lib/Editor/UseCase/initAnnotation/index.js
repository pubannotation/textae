import DataSource from '../../DataSource.js'
import { RESOURCE_TYPE } from '../../RESOURCE_TYPE.js'
import setAnnotationAndConfiguration from '../setAnnotationAndConfiguration.js'
import setLoadedAnnotation from './setLoadedAnnotation.js'
import alertifyjs from 'alertifyjs'

/**
 *
 * @param {import('../../StartUpOptions/index.js').default)} startUpOptions
 */
export default async function (
  spanConfig,
  annotationModel,
  remoteResource,
  menuState,
  originalData,
  startUpOptions,
  functionAvailability
) {
  switch (startUpOptions.resourceType) {
    case RESOURCE_TYPE.QUERY_PARAMETER: {
      let annotation
      try {
        annotation = await startUpOptions.annotation()
      } catch {
        alertifyjs.error(`failed to load annotation from query parameter.`)
        return
      }

      setLoadedAnnotation(
        DataSource.createParameterSource(annotation),
        startUpOptions.config,
        remoteResource,
        menuState,
        spanConfig,
        annotationModel,
        functionAvailability,
        originalData
      )
      break
    }
    case RESOURCE_TYPE.INLINE: {
      let annotation
      try {
        annotation = await startUpOptions.annotation()
      } catch {
        alertifyjs.error(
          `failed to load annotation from directly included in the div element.`
        )
        return
      }

      setLoadedAnnotation(
        DataSource.createInlineSource(annotation),
        startUpOptions.config,
        remoteResource,
        menuState,
        spanConfig,
        annotationModel,
        functionAvailability,
        originalData
      )
      break
    }
    case RESOURCE_TYPE.REMOTE_URL:
      // Load an annotation from server.
      remoteResource.loadAnnotation(startUpOptions.annotationURL)
      break
    default:
      if (startUpOptions.config) {
        remoteResource.loadConfiguration(startUpOptions.config)
      } else {
        setAnnotationAndConfiguration(
          originalData.defaultConfiguration,
          menuState,
          spanConfig,
          annotationModel,
          originalData.defaultAnnotation,
          functionAvailability
        )
      }
  }
}
