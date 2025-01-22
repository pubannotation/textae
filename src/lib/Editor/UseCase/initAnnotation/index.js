import DataSource from '../../DataSource.js'
import { RESOURCE_TYPE } from '../../RESOURCE_TYPE.js'
import setAnnotationAndConfiguration from '../setAnnotationAndConfiguration.js'
import setLoadedAnnotation from './setLoadedAnnotation.js'

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
  const resourceType = await startUpOptions.resourceType()
  const annotation = await startUpOptions.annotation()

  switch (resourceType) {
    case RESOURCE_TYPE.QUERY_PARAMETER:
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
    case RESOURCE_TYPE.INLINE:
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
