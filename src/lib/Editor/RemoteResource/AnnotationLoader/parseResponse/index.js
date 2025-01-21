import { isJsonResponse, isMarkdownResponse } from './responseTypes'
import AnnotationConverter from '../../../../AnnotationConverter'

export default async function parseResponse(response, url, onLoaded, onFailed) {
  if (isJsonResponse(response, url)) {
    const json_annotation = await response.json()
    onLoaded(json_annotation)
  } else if (isMarkdownResponse(response, url)) {
    const inline_annotation = await response.text()
    const json_annotation =
      await AnnotationConverter.inline2json(inline_annotation)

    onLoaded(json_annotation)
  } else {
    onFailed()
  }
}
