import { isJsonResponse, isTxtResponse } from './responseTypes'
import InlineAnnotationConverter from '../../../InlineAnnotationConverter'

export default async function parseResponse(response, url) {
  if (isJsonResponse(response, url)) {
    return await response.json()
  } else if (isTxtResponse(response, url)) {
    const inline_annotation = await response.text()
    return await new InlineAnnotationConverter(
      'https://pubannotation.org/conversions/inline2json'
    ).toJSON(inline_annotation)
  } else {
    throw new Error('The content type of the loaded content is not supported.')
  }
}
