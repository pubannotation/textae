import readFile from './readFile'
import isJSON from './isJSON'
import isTxtFile from './isTxtFile'
import DataSource from '../../DataSource'

export default async function (file, editor) {
  const event = await readFile(file)
  const fileContent = event.target.result

  if (isTxtFile(file.name)) {
    // If this is .txt, New annotation json is made from .txt
    editor.eventEmitter.emit(
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
      editor.eventEmitter.emit(
        'textae-event.resource.annotation.load.success',
        new DataSource('local file', file.name, annotation)
      )

      return
    }
  }

  editor.eventEmitter.emit(
    'textae-event.resource.annotation.format.error',
    new DataSource('local file', file.name)
  )
}
