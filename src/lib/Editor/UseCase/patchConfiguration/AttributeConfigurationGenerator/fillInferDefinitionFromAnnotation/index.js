import fill from './fill'
import inferDefinitionFromAnnotation from './inferDefinitionFromAnnotation'

export default function (config, annotations) {
  const inferDefinitions = inferDefinitionFromAnnotation(annotations)
  return fill(config, inferDefinitions)
}
