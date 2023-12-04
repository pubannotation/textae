import clone from '../../clone'
import getAnntationMap from '../getAnnotationMap'
import getSelectionAttributes from './getSelectionAttributes'

// Sets a default value for the definition of a selection attribute that does not have a default value.
//
// A sample definition of the full form of the selection attribute:
// {
//   "pred": "denote",
//   "value type": "selection",
//   "values": [
//     {
//       "color": "#0000FF",
//       "label": "Regulation",
//       "id": "http://www.yahoo.co.jp/eeeeeeeeeeeeeeeeeoaoeuaoeuaoue",
//       "default": true
//     },
//     {
//       "color": "#FF0000",
//       "id": "Cell"
//     },
//     {
//       "id": "equivalentTo"
//     }
//   ]
// }
//
// A sample of selection attribute annotation:
// {
//   "id": "A3",
//   "subj": "E1:a:b",
//   "pred": "denote",
//   "obj": "Cell"
// }
export default function (config, annotations) {
  config = clone(config)

  const annotationMap = getAnntationMap(annotations)
  for (const attr of getSelectionAttributes(config)) {
    if (!attr.values || attr.values.length === 0) {
      attr.values = [{ id: 'default', default: true }]
      continue
    }

    if (!attr.values.find((v) => v.default === true)) {
      // If this attribute is used in the annotation, it defaults to the most commonly used value.
      // Unless it is not used in the annotation, the first value is the default.
      if (annotationMap.has(attr.pred)) {
        const afp = annotationMap.get(attr.pred)
        attr.values.find((v) => v.id === afp.mostFrequentObject).default = true
      } else {
        attr.values[0].default = true
      }
      continue
    }
  }

  return config
}
