import { isJsonResponse, isTxtResponse } from './responseTypes'
import SimpleInlineTextAnnotation from 'simple-inline-text-annotation'

export default async function parseResponse(response, url) {
  if (isJsonResponse(response, url)) {
    return await response.json()
  } else if (isTxtResponse(response, url)) {
    const inline_annotation = await response.text()
    return SimpleInlineTextAnnotation.parse(inline_annotation)
  } else {
    throw new Error('The content type of the loaded content is not supported.')
  }
}
