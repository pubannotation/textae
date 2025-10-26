import alertifyjs from 'alertifyjs'

import isJSON from '../../../../isJSON'
import DataSource from '../../../DataSource'
import isTxtFile from '../isTxtFile'
import readFile from '../readFile'
import parseFileContent from './parseFileContent'

export default async function readAnnotationFile(file, eventEmitter) {
  const event = await readFile(file)
  const fileContent = event.target.result

  // SimpleInlineTextAnnotation uses the txt extension.
  // If this is .txt, parse first and then saving the content.
  if (isTxtFile(file.name)) {
    const annotation = parseFileContent(fileContent)

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
