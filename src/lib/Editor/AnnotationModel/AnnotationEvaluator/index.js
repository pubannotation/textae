import getAllSpansOf from './getAllSpansOf'
import parseTracks from './parseTracks'
import readAcceptedAnnotationTo from './readAcceptedAnnotationTo'
import validateAnnotation from './validateAnnotation'

export default class AnnotationEvaluator {
  #namespaceInstanceContainer
  #spanInstanceContainer
  #entityInstanceContainer
  #relationInstanceContainer
  #attributeInstanceContainer
  #rowData
  #rootReject
  #trackRejects

  constructor(annotationModel, rowData) {
    const {
      namespaceInstanceContainer,
      spanInstanceContainer,
      entityInstanceContainer,
      attributeInstanceContainer,
      relationInstanceContainer
    } = annotationModel
    this.#namespaceInstanceContainer = namespaceInstanceContainer
    this.#spanInstanceContainer = spanInstanceContainer
    this.#entityInstanceContainer = entityInstanceContainer
    this.#relationInstanceContainer = relationInstanceContainer
    this.#attributeInstanceContainer = attributeInstanceContainer
    this.#rowData = rowData
  }

  eval() {
    // Read namespaces
    if (this.#rowData.namespaces) {
      this.#namespaceInstanceContainer.addSource(
        this.#rowData.namespaces.map((n) => ({
          id: n.prefix,
          ...n
        }))
      )
    } else {
      this.#namespaceInstanceContainer.addSource([])
    }

    // Read the root annotation.
    const { accept, reject } = validateAnnotation(
      this.#text,
      this.#spans,
      this.#rowData
    )

    readAcceptedAnnotationTo(
      this.#spanInstanceContainer,
      this.#entityInstanceContainer,
      this.#attributeInstanceContainer,
      this.#relationInstanceContainer,
      accept
    )

    reject.name = 'Root annotations.'
    this.#rootReject = reject

    // Read multiple track annotations.
    if (this.hasMultiTracks) {
      this.#trackRejects = parseTracks(
        this.#spanInstanceContainer,
        this.#entityInstanceContainer,
        this.#attributeInstanceContainer,
        this.#relationInstanceContainer,
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
