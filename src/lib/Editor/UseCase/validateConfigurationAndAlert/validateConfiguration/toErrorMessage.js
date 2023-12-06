import anemone from '../../../../component/anemone'

export default function (errors) {
  for (const e of errors) {
    if (e.keyword === 'required') {
      return `Invalid configuration: The attribute type whose predicate is '${e.data.pred}' misses a mandatory property, '${e.params.missingProperty}'.`
    } else if (e.instancePath.includes('color')) {
      return anemone`Invalid configuration: '${e.data}' is invalid color format.`
    }
  }
}
