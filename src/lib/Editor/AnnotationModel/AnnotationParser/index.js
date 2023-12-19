import readAcceptedAnnotationTo from './readAcceptedAnnotationTo'
import parseTracks from './parseTracks'
import getAllSpansOf from './getAllSpansOf'
import validateAnnotation from './validateAnnotation'

export default class AnnotationParser {
  #namespaceContainer
  #spanContainer
  #entityContainer
  #attributeContainer
  #relationContainer
  #rowData
  #rootReject
  #trackRejects

  constructor(
    namespaceContainer,
    spanContainer,
    entityContainer,
    attributeContainer,
    relationContainer,
    rowData
  ) {
    this.#namespaceContainer = namespaceContainer
    this.#spanContainer = spanContainer
    this.#entityContainer = entityContainer
    this.#attributeContainer = attributeContainer
    this.#relationContainer = relationContainer
    this.#rowData = rowData
  }

  parse() {
    // Read namespaces
    if (this.#rowData.namespaces) {
      this.#namespaceContainer.addSource(
        this.#rowData.namespaces.map((n) => ({
          id: n.prefix,
          ...n
        }))
      )
    } else {
      this.#namespaceContainer.addSource([])
    }

    // Read the root annotation.
    const { accept, reject } = validateAnnotation(
      this.#text,
      this.#spans,
      this.#rowData
    )

    readAcceptedAnnotationTo(
      this.#spanContainer,
      this.#entityContainer,
      this.#attributeContainer,
      this.#relationContainer,
      accept
    )

    reject.name = 'Root annotations.'
    this.#rootReject = reject

    // Read multiple track annotations.
    if (this.hasMultiTracks) {
      this.#trackRejects = parseTracks(
        this.#spanContainer,
        this.#entityContainer,
        this.#attributeContainer,
        this.#relationContainer,
        this.#text,
        this.#spans,
        this.#rowData
      )
    }
  }

  get hasMultiTracks() {
    return Boolean(this.#rowData.tracks)
  }

  get rejects() {
    if (this.hasMultiTracks) {
      return [this.#rootReject].concat(this.#trackRejects)
    } else {
      return [this.#rootReject]
    }
  }

  get #text() {
    return this.#rowData.text
  }

  get #spans() {
    return getAllSpansOf(this.#rowData)
  }
}
