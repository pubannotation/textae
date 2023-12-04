import getAnnotationMap from '../../getAnnotationMap'

// Generates a definition of an attribute by inferring a definition from the value of an annotation.
export default function (annotations) {
  return [...getAnnotationMap(annotations).values()].map((a) => a.definition)
}
