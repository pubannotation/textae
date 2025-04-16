import SimpleInlineTextAnnotation from 'simple-inline-text-annotation'

export default async function parseFileContent(fileContent) {
  try {
    const annotation = SimpleInlineTextAnnotation.parse(fileContent)

    return annotation
  } catch {
    return null
  }
}
