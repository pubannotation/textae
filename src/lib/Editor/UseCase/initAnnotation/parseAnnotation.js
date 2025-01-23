import alertifyjs from 'alertifyjs'

export default async function parseAnnotation(startUpOptions) {
  try {
    return await startUpOptions.annotation()
  } catch (e) {
    alertifyjs.error(`failed to convert annotation: ${e.message}`)
    return null
  }
}
