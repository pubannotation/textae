import alertifyjs from 'alertifyjs'

export default async function parseAnnotation(startUpOptions, resourceType) {
  try {
    return await startUpOptions.annotation()
  } catch (e) {
    alertifyjs.error(
      `failed to load annotation from ${resourceType}.<br>${e.message}`
    )
    return null
  }
}
