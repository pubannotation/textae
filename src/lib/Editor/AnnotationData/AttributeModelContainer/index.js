import AttributeModel from './AttributeModel'
import IdIssueContainer from '../IdIssueContainer'
import WikiMedia from './WikiMedia'

export default class AttributeModelContainer extends IdIssueContainer {
  constructor(
    emitter,
    entityContainer,
    relationContaier,
    namespace,
    definitionContainer
  ) {
    super(emitter, 'attribute', () => 'A')

    this._entityContainer = entityContainer
    this._relationContaier = relationContaier
    this._namespace = namespace
    this._definitionContainer = definitionContainer
    this._wikiMedia = new WikiMedia()
  }

  _toModel(attribute) {
    return new AttributeModel(
      attribute,
      this._entityContainer,
      this._relationContaier,
      this._namespace,
      this._definitionContainer,
      this._wikiMedia
    )
  }

  add(newValue) {
    // When redoing, the newValue is instance of the AttributeModel already.
    newValue =
      newValue instanceof AttributeModel ? newValue : this._toModel(newValue)

    super.add(newValue)

    newValue.updateElement()

    return newValue
  }

  change(id, newPred, newObj) {
    const model = this.get(id)

    if (newPred) {
      model.pred = newPred
    }

    if (newObj) {
      model.obj = newObj
    }

    return model
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
   * @returns {AttributeModel[]}
   */
  getAttributesFor(subj) {
    return this.all
      .filter((a) => a.subj === subj)
      .sort((a, b) => this._definitionContainer.attributeCompareFunction(a, b))
  }
}
