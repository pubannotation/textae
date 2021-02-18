import Observable from 'observ'
import EntityContainer from './EntityContainer'
import Container from './Container'
import AttributeContainer from './AttributeContainer'

export default class TypeDefinition {
  constructor(editor, entity, relation, attribute) {
    this._editor = editor
    this._attributeContainer = new AttributeContainer(this._editor, attribute)
    this._denotationContainer = new EntityContainer(
      editor,
      () => entity.denotations
    )
    this._relationContainer = new Container(
      editor,
      'relation',
      () => relation.all
    )
    this._blockContainer = new EntityContainer(editor, () => entity.blocks)

    this._lockStateObservable = new Observable(false)
    this._lockStateObservable(() =>
      this._editor.eventEmitter.emit(`textae-event.type-definition.type.lock`)
    )
  }

  get denotation() {
    return this._denotationContainer
  }

  get block() {
    return this._blockContainer
  }

  get relation() {
    return this._relationContainer
  }

  get attribute() {
    return this._attributeContainer
  }

  get config() {
    const ret = {}

    if (this._denotationContainer.config.length) {
      ret['entity types'] = this._denotationContainer.config
    }

    if (this._relationContainer.config.length) {
      ret['relation types'] = this._relationContainer.config
    }

    if (this._attributeContainer.config.length) {
      ret['attribute types'] = this._attributeContainer.config
    }

    if (this._blockContainer.config.length) {
      ret['block types'] = this._blockContainer.config
    }

    return ret
  }

  get isLock() {
    return this._lockStateObservable()
  }

  lockEdit() {
    this._lockStateObservable.set(true)
  }
  unlockEdit() {
    this._lockStateObservable.set(false)
  }

  setTypeConfig(config) {
    if (config) {
      this._denotationContainer.definedTypes = config['entity types'] || []
      this._relationContainer.definedTypes = config['relation types'] || []
      this._attributeContainer.definedTypes = config['attribute types'] || []
      this._blockContainer.definedTypes = config['block types'] || []
      this.autocompletionWs = config['autocompletion_ws']
    } else {
      this._denotationContainer.definedTypes = []
      this._relationContainer.definedTypes = []
      this._attributeContainer.definedTypes = []
      this._blockContainer.definedTypes = []
      this.autocompletionWs = ''
    }

    this._editor.eventEmitter.emit(`textae-event.type-definition.reset`)
  }
}
