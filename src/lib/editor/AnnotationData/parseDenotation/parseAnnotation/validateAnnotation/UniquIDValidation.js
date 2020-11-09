import Validation from './Validation'

export default class UniquIDValidation extends Validation {
  constructor(nodes) {
    super(nodes, (node) => nodes.filter((n) => n.id === node.id).length === 1)
  }
}
