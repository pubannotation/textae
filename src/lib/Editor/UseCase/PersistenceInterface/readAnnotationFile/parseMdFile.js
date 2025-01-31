import InlineAnnotationConverter from '../../../InlineAnnotationConverter'

export default async function parseMdFile(fileContent) {
  try {
    const annotation = await new InlineAnnotationConverter(
      'https://pubannotation.org/conversions/inline2json'
    ).toJSON(fileContent)

    return annotation
  } catch {
    return null
  }
}
