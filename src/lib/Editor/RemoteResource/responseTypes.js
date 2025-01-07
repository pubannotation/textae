import path from 'path-browserify'

export function isJsonResponse(response, url) {
  const fileExtension = path.extname(url)
  const contentType = response.headers.get('Content-Type')

  return (
    fileExtension === '.json' ||
    (contentType && contentType.includes('application/json'))
  )
}

export function isMarkdownResponse(response, url) {
  const fileExtension = path.extname(url)
  const contentType = response.headers.get('Content-Type')

  return (
    fileExtension === '.md' ||
    (contentType && contentType.includes('text/markdown'))
  )
}
