import Container from './Container'

export default class EntityContainer extends Container {
  constructor(editor, getAllInstanceFunc, lockStateObservable) {
    super(editor, 'entity', getAllInstanceFunc, lockStateObservable, '#77DDDD')
  }
}
