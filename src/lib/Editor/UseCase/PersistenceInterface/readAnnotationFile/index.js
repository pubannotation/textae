import readFile from '../readFile'
import isJSON from '../../../../isJSON'
import isTxtFile from '../isTxtFile'
import isMdFile from '../isMdFile'
import DataSource from '../../../DataSource'
import parseMdFile from './parseMdFile'
import alertifyjs from 'alertifyjs'

export default async function readAnnotationFile(file, eventEmitter) {
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
    const annotation = await parseMdFile(fileContent)

    if (!annotation) {
      const dataSource = DataSource.createFileSource(file.name)
      alertifyjs.error(
        `Failed to load annotation from ${dataSource.displayName}.`
      )
      return
    }

    if (annotation.text) {
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
