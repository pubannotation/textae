import { isJsonResponse, isMarkdownResponse } from './responseTypes'
import convertTextAnnotationToJSON from '../convertTextAnnotationToJSON'

export default function parseResponse(response, url, onLoaded, onFailed) {
  if (isJsonResponse(response, url)) {
    response.json().then((annotation) => onLoaded(annotation))
  } else if (isMarkdownResponse(response, url)) {
    response.text().then((text) => {
      convertTextAnnotationToJSON(text).then((annotation) => {
        if (annotation) {
          onLoaded(annotation)
        } else {
          onFailed
        }
      })
    })
  } else {
    onFailed
  }
}
