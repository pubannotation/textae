import readFile from './readFile'
import isJSON from './isJSON'
import isTxtFile from './isTxtFile'
import DataSource from '../../DataSource'

export default async function (file, eventEmitter) {
  const event = await readFile(file)
  const fileContent = event.target.result

  if (isTxtFile(file.name)) {
    // If this is .txt, New annotation json is made from .txt
    eventEmitter.emit(
      'textae-event.resource.annotation.load.success',
      new DataSource('local file', file.name, {
        text: fileContent
      })
    )

    return
  }

  if (isJSON(fileContent)) {
    const annotation = JSON.parse(fileContent)

    if (annotation.text) {
      eventEmitter.emit(
        'textae-event.resource.annotation.load.success',
        new DataSource('local file', file.name, annotation)
      )

      return
    }
  }

  eventEmitter.emit(
    'textae-event.resource.annotation.format.error',
    new DataSource('local file', file.name)
  )
}
