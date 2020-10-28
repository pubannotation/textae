import Observable from 'observ'
import EntityContainer from './EntityContainer'
import Container from './Container'
import AttributeContainer from './AttributeContainer'

export default class TypeDefinition {
  constructor(editor, annotationData) {
    this._editor = editor
    this._lockStateObservable = new Observable(false)
    this._attributeContainer = new AttributeContainer(
      this._editor,
      annotationData.attribute
    )
    this._entityContainer = new EntityContainer(
      editor,
      () => annotationData.entity.all,
      this._attributeContainer,
      this._lockStateObservable
    )
    this._relationContainer = new Container(
      editor,
      'relation',
      () => annotationData.relation.all,
      this._lockStateObservable
    )

    this._lockStateObservable(() =>
      this._editor.eventEmitter.emit(`textae.typeDefinition.type.lock`)
    )
  }

  isLock() {
    return this._lockStateObservable()
  }

  lockEdit() {
    this._lockStateObservable.set(true)
  }
  unlockEdit() {
    this._lockStateObservable.set(false)
  }

  get entity() {
    return this._entityContainer
  }

  setTypeConfig(config) {
    if (config) {
      this._entityContainer.definedTypes = [
        config['entity types'] || [],
        config['attribute types'] || []
      ]
      this._relationContainer.definedTypes = config['relation types'] || []
      this.autocompletionWs = config['autocompletion_ws']
    } else {
      this._entityContainer.definedTypes = []
      this._relationContainer.definedTypes = []
      this.autocompletionWs = ''
    }

    this._editor.eventEmitter.emit(`textae.typeDefinition.reset`)
  }

  get relation() {
    return this._relationContainer
  }

  get config() {
    const ret = {}

    if (this._entityContainer.config.length) {
      ret['entity types'] = this._entityContainer.config
    }

    if (this._relationContainer.config.length) {
      ret['relation types'] = this._relationContainer.config
    }

    if (this._attributeContainer.config.length) {
      ret['attribute types'] = this._attributeContainer.config
    }

    return ret
  }
}
