import isContains from './isContains'
import Validation from './Validation'

export default class SubjectValidation extends Validation {
  constructor(denotations, nodes) {
    super(nodes, (node) => isContains(denotations, node.subj))
  }
}
