import Container from './Container'

export default class EntityContainer extends Container {
  constructor(editor, getAllInstanceFunc) {
    super(editor, 'entity', getAllInstanceFunc, '#77DDDD')
  }
}
