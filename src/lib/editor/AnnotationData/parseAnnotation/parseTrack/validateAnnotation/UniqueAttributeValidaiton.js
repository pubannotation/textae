import Validation from './Validation'

// An entity cannot have two attributes of the same predicate.
export default class UniqueAttributeValidaiton extends Validation {
  constructor(attributes) {
    super(
      attributes,
      (node) =>
        attributes.filter((a) => a.subj === node.subj && a.pred === node.pred)
          .length === 1
    )
  }
}
