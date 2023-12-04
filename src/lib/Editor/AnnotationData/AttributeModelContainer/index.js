import AttributeInstance from './AttributeInstance'
import IdIssueContainer from '../IdIssueContainer'
import MediaDictionary from './MediaDictionary'

export default class AttributeModelContainer extends IdIssueContainer {
  constructor(
    emitter,
    entityContainer,
    relationContainer,
    namespace,
    definitionContainer
  ) {
    super(emitter, 'attribute', () => 'A')

    this._entityContainer = entityContainer
    this._relationContainer = relationContainer
    this._namespace = namespace
    this._definitionContainer = definitionContainer
    this._mediaDictionary = new MediaDictionary()
  }

  _toModel(attribute) {
    return new AttributeInstance(
      attribute,
      this._entityContainer,
      this._relationContainer,
      this._namespace,
      this._definitionContainer,
      this._mediaDictionary
    )
  }

  add(newValue) {
    // When redoing, the newValue is instance of the AttributeInstance already.
    newValue =
      newValue instanceof AttributeInstance ? newValue : this._toModel(newValue)

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
      .sort((a, b) => this._definitionContainer.attributeCompareFunction(a, b))
  }
}
