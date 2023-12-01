import alertifyjs from 'alertifyjs'
import hasAllValueDefinitionOfSelectionAttributes from './hasAllValueDefinitionOfSelectionAttributes'

export default function (annotation, config) {
  const error = hasAllValueDefinitionOfSelectionAttributes(annotation, config)

  if (error) {
    alertifyjs.error(error)
    return
  }

  return config
}
