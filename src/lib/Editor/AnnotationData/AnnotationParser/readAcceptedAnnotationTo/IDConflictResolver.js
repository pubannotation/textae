// To avoid ID collisions when reading multi-track annotations,
// add the track number before the ID.
export default class IDConflictResolver {
  constructor(trackNumber) {
    this._trackNumber = trackNumber
  }

  addTrackNumberAsIDPrefix(denotation, block, relation, attribute) {
    const denotations = denotation.map((src) => ({
      ...src,
      id: this._prependToIDOf(src)
    }))

    const blocks = block.map((src) => ({
      ...src,
      id: this._prependToIDOf(src)
    }))

    // The attribute refers to the entities contained in the denotation or block by subject.
    const attributes = attribute.map((src) => ({
      ...src,
      id: this._prependToIDOf(src),
      subj: this._prependTrackNumberTo(src.subj),
      obj: src.obj
    }))

    // The relation refers to the entities contained in the denotation or block by subject and object.
    const relations = relation.map((src) => ({
      ...src,
      id: this._prependToIDOf(src),
      subj: this._prependTrackNumberTo(src.subj),
      obj: this._prependTrackNumberTo(src.obj)
    }))

    return {
      denotations,
      blocks,
      relations,
      attributes
    }
  }

  // Set Prefx to the ID if ID exists.
  // IF the ID does not exist, Set new ID in addSource function.
  _prependToIDOf(src) {
    return src.id ? this._prependTrackNumberTo(src.id) : null
  }

  _prependTrackNumberTo(val) {
    return this._trackNumber + val
  }
}
