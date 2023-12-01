import Observable from 'observ'

export default class TypeDefinition {
  /**
   *
   * @param {import('../AttributeDefinitionContainer').default} attribute
   */
  constructor(
    eventEmitter,
    denotation,
    block,
    relation,
    attribute,
    configLocked = true
  ) {
    this._eventEmitter = eventEmitter
    this._denotationContainer = denotation
    this._blockContainer = block
    this._relationContainer = relation
    this._attributeContainer = attribute

    this._lockStateObservable = new Observable(false)
    this._lockStateObservable(() =>
      this._eventEmitter.emit(`textae-event.type-definition.lock`)
    )
    this._lockStateObservable.set(configLocked)
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

    this._eventEmitter.emit(`textae-event.type-definition.reset`)
  }
}
