// To avoid ID collisions when reading multi-track annotations,
// add the track number before the ID.
export default function (denotation, block, relation, attribute, trackNumber) {
  const denotations = denotation.map((src) => ({
    ...src,
    id: setIDPrefix(src, trackNumber)
  }))

  const blocks = block.map((src) => ({
    ...src,
    id: setIDPrefix(src, trackNumber)
  }))

  // The attribute refers to the entities contained in the denotation or block by subject.
  const attributes = attribute.map((src) => ({
    ...src,
    id: setIDPrefix(src, trackNumber),
    subj: trackNumber + src.subj,
    obj: src.obj
  }))

  // The relation refers to the entities contained in the denotation or block by subject and object.
  const relations = relation.map((src) => ({
    ...src,
    id: setIDPrefix(src, trackNumber),
    subj: trackNumber + src.subj,
    obj: trackNumber + src.obj
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
function setIDPrefix(src, trackNumber) {
  return src.id ? trackNumber + src.id : null
}
