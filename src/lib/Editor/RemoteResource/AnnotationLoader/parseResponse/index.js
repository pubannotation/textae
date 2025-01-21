import { isJsonResponse, isMarkdownResponse } from './responseTypes'
import AnnotationConverter from '../../../../AnnotationConverter'

export default async function parseResponse(response, url) {
  if (isJsonResponse(response, url)) {
    return await response.json()
  } else if (isMarkdownResponse(response, url)) {
    const inline_annotation = await response.text()
    return await AnnotationConverter.inline2json(inline_annotation)
  } else {
    throw new Error('The content type of the loaded content is not supported.')
  }
}
