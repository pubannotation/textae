export default class ViewHandler {
  constructor(namespace, definitionContainer) {
    this._namespace = namespace
    this._denititionContainer = definitionContainer
  }

  relationClicked(_, relation, attribute) {
    const { href } = attribute || relation

    if (href) {
      window.open(href, '_blank')
    }
  }
}
