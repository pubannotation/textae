export default class ViewHandler {
  constructor(namespace, definitionContainer) {
    this._namespace = namespace
    this._denititionContainer = definitionContainer
  }

  relationClicked(_, relation) {
    const { href } = relation

    if (href) {
      window.open(href, '_blank')
    }
  }

  // Dummy funtion for shotcut key 'w'.
  changeInstance() {}

  // Dummy funtion for shotcut key '1' ~ '9'.
  manipulateAttribute() {}
}
