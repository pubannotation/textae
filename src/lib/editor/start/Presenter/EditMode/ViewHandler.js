export default class ViewHandler {
  constructor(namespace, definitionContainer) {
    this._namespace = namespace
    this._denititionContainer = definitionContainer
  }

  relationClicked(_, relation) {
    const link = relation.href

    if (link) {
      window.open(link, '_blank')
    }
  }

  // Dummy funtion for shotcut key 'w'.
  changeInstance() {}

  // Dummy funtion for shotcut key '1' ~ '9'.
  manipulateAttribute() {}
}
