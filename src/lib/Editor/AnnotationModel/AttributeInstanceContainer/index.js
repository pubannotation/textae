import IdIssueContainer from '../IdIssueContainer'
import AttributeInstance from './AttributeInstance'
import MediaDictionary from './MediaDictionary'

export default class AttributeInstanceContainer extends IdIssueContainer {
  #entityInstanceContainer
  #relationInstanceContainer
  #namespaceInstanceContainer
  #definitionContainer
  #mediaDictionary

  constructor(
    emitter,
    entityInstanceContainer,
    relationInstanceContainer,
    namespaceInstanceContainer,
    definitionContainer
  ) {
    super(emitter, 'attribute', () => 'A')

    this.#entityInstanceContainer = entityInstanceContainer
    this.#relationInstanceContainer = relationInstanceContainer
    this.#namespaceInstanceContainer = namespaceInstanceContainer
    this.#definitionContainer = definitionContainer
    this.#mediaDictionary = new MediaDictionary()
  }

  _toInstance(attribute) {
    return new AttributeInstance(
      attribute,
      this.#entityInstanceContainer,
      this.#relationInstanceContainer,
      this.#namespaceInstanceContainer,
      this.#definitionContainer,
      this.#mediaDictionary
    )
  }

  add(newValue) {
    // When redoing, the newValue is instance of the AttributeInstance already.
    newValue =
      newValue instanceof AttributeInstance
        ? newValue
        : this._toInstance(newValue)

    super.add(newValue)

    newValue.updateElement()

    return newValue
  }

  change(id, newPred, newObj) {
    const instance = this.get(id)

    if (newPred) {
      instance.pred = newPred
    }

    if (newObj) {
      instance.obj = newObj
    }

    return instance
  }

  remove(id) {
    const instance = super.remove(id)

    console.assert(instance, `There are no attribute ${id} to delete!`)

    instance.updateElement()
  }

  getSameDefinitionsAttributes(pred) {
    return this.all.filter((attr) => attr.pred === pred)
  }

  getSameAttributes(pred, obj) {
    return this.all.filter((a) => a.equalsTo(pred, obj))
  }

  /**
   *
   * @param {string} subj
   * @returns {AttributeInstance[]}
   */
  getAttributesFor(subj) {
    return this.all
      .filter((a) => a.subj === subj)
      .sort((a, b) => this.#definitionContainer.attributeCompareFunction(a, b))
  }
}
