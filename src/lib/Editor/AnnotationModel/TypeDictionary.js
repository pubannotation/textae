import Observable from 'observ'

export default class TypeDictionary {
  #eventEmitter
  #denotationContainer
  #blockContainer
  #relationContainer
  #attributeContainer
  #autocompletionWs
  #lockStateObservable = new Observable(false)

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
    this.#eventEmitter = eventEmitter
    this.#denotationContainer = denotation
    this.#blockContainer = block
    this.#relationContainer = relation
    this.#attributeContainer = attribute

    this.#lockStateObservable(() =>
      this.#eventEmitter.emit(`textae-event.type-definition.lock`)
    )
    this.#lockStateObservable.set(configLocked)
  }

  set autocompletionWs(value) {
    this.#autocompletionWs = value
  }

  get denotation() {
    return this.#denotationContainer
  }

  get block() {
    return this.#blockContainer
  }

  get relation() {
    return this.#relationContainer
  }

  get attribute() {
    return this.#attributeContainer
  }

  get autocompletionWs() {
    return this.#autocompletionWs
  }

  get config() {
    const ret = {}

    if (this.#denotationContainer.config.length) {
      ret['entity types'] = this.#denotationContainer.config
    }

    if (this.#relationContainer.config.length) {
      ret['relation types'] = this.#relationContainer.config
    }

    if (this.#attributeContainer.config.length) {
      ret['attribute types'] = this.#attributeContainer.config
    }

    if (this.#blockContainer.config.length) {
      ret['block types'] = this.#blockContainer.config
    }

    return ret
  }

  get isLock() {
    return this.#lockStateObservable()
  }

  lockEdit() {
    this.#lockStateObservable.set(true)
  }
  unlockEdit() {
    this.#lockStateObservable.set(false)
  }

  setTypeConfig(config) {
    if (config) {
      this.#denotationContainer.config = config['entity types']
      this.#relationContainer.config = config['relation types']
      this.#attributeContainer.config = config['attribute types']
      this.#blockContainer.config = config['block types']
      this.#autocompletionWs = config['autocompletion_ws']
    } else {
      this.#denotationContainer.config = null
      this.#relationContainer.config = null
      this.#attributeContainer.config = null
      this.#blockContainer.config = null
      this.#autocompletionWs = ''
    }

    this.#eventEmitter.emit(`textae-event.type-definition.reset`)
  }
}
