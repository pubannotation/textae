import readFile from './readFile'
import isJSON from '../../../isJSON'
import isTxtFile from './isTxtFile'
import isMdFile from './isMdFile'
import DataSource from '../../DataSource'
import AnnotationConverter from '../../../AnnotationConverter'

export default async function (file, eventEmitter) {
  const event = await readFile(file)
  const fileContent = event.target.result

  if (isTxtFile(file.name)) {
    // If this is .txt, New annotation json is made from .txt
    eventEmitter.emit(
      'textae-event.resource.annotation.load.success',
      DataSource.createFileSource(file.name, {
        text: fileContent
      })
    )

    return
  }

  if (isMdFile(file.name)) {
    const converter = new AnnotationConverter()
    const annotation = await converter.inline2json(fileContent)

    if (annotation && annotation.text) {
      eventEmitter.emit(
        'textae-event.resource.annotation.load.success',
        DataSource.createFileSource(file.name, annotation)
      )

      return
    }
  }

  if (isJSON(fileContent)) {
    const annotation = JSON.parse(fileContent)

    if (annotation.text) {
      eventEmitter.emit(
        'textae-event.resource.annotation.load.success',
        DataSource.createFileSource(file.name, annotation)
      )

      return
    }
  }

  eventEmitter.emit(
    'textae-event.resource.annotation.format.error',
    DataSource.createFileSource(file.name)
  )
}
