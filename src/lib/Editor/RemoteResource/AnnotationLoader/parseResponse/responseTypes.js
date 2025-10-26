import path from 'path-browserify'

export function isJsonResponse(response, url) {
  const fileExtension = path.extname(url)
  const contentType = response.headers.get('Content-Type')

  return fileExtension === '.json' || contentType?.includes('application/json')
}

export function isTxtResponse(response, url) {
  const fileExtension = path.extname(url)
  const contentType = response.headers.get('Content-Type')

  return fileExtension === '.txt' || contentType?.includes('text/plain')
}
