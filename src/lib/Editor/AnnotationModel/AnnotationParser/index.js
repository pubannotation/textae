import readAcceptedAnnotationTo from './readAcceptedAnnotationTo'
import parseTracks from './parseTracks'
import getAllSpansOf from './getAllSpansOf'
import validateAnnotation from './validateAnnotation'

export default class AnnotationParser {
  constructor(
    namespaceContainer,
    spanContainer,
    entityContainer,
    attributeContainer,
    relationContainer,
    rowData
  ) {
    this._namespaceContainer = namespaceContainer
    this._spanContainer = spanContainer
    this._entityContainer = entityContainer
    this._attributeContainer = attributeContainer
    this._relationContainer = relationContainer
    this._rowData = rowData
  }

  parse() {
    // Read namespaces
    if (this._rowData.namespaces) {
      this._namespaceContainer.addSource(
        this._rowData.namespaces.map((n) => ({
          id: n.prefix,
          ...n
        }))
      )
    } else {
      this._namespaceContainer.addSource([])
    }

    // Read the root annotation.
    const { accept, reject } = validateAnnotation(
      this._text,
      this._spans,
      this._rowData
    )

    readAcceptedAnnotationTo(
      this._spanContainer,
      this._entityContainer,
      this._attributeContainer,
      this._relationContainer,
      accept
    )

    reject.name = 'Root annotations.'
    this._rootReject = reject

    // Read multiple track annotations.
    if (this.hasMultiTracks) {
      this._trackRejects = parseTracks(
        this._spanContainer,
        this._entityContainer,
        this._attributeContainer,
        this._relationContainer,
        this._text,
        this._spans,
        this._rowData
      )
    }
  }

  get hasMultiTracks() {
    return Boolean(this._rowData.tracks)
  }

  get rejects() {
    if (this._trackRejects) {
      return [this._rootReject].concat(this._trackRejects)
    } else {
      return [this._rootReject]
    }
  }

  get _text() {
    return this._rowData.text
  }

  get _spans() {
    return getAllSpansOf(this._rowData)
  }
}
