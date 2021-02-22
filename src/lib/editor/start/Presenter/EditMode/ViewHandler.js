export default class ViewHandler {
  constructor(namespace, definitionContainer) {
    this._namespace = namespace
    this._denititionContainer = definitionContainer
  }

  relationClicked(_, relation) {
    // Open link when view mode because link in label of jsPlumb event is not fired.
    const link = relation.getLink(this._namespace, this._denititionContainer)

    if (link) {
      const href = link.getAttribute('href')
      window.open(href, '_blank')
    }
  }

  // Dummy funtion for shotcut key 'w'.
  changeInstance() {}

  // Dummy funtion for shotcut key '1' ~ '9'.
  manipulateAttribute() {}
}
