import DataSource from '../../DataSource.js'
import { RESOURCE_TYPE } from '../../RESOURCE_TYPE.js'
import setAnnotationAndConfiguration from '../setAnnotationAndConfiguration.js'
import setLoadedAnnotation from './setLoadedAnnotation.js'
import parseAnnotation from './parseAnnotation.js'

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
      const annotation = await parseAnnotation(
        startUpOptions,
        'query parameter'
      )

      if (annotation) {
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
      }
      break
    }
    case RESOURCE_TYPE.INLINE: {
      const annotation = await parseAnnotation(
        startUpOptions,
        'directly included in the div element'
      )

      if (annotation) {
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
      }
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
