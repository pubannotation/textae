import fillInferDefinitionFormAnnotation from './fillInferDefinitionFormAnnotation'
import fillDefaultValueOfSelectionAttributes from './fillDefaultValueOfSelectionAttributes'

export default class AttributeConfigurationGenerator {
  constructor(config = [], annotations = []) {
    this._annotations = annotations
    this._config = config
  }

  get configuration() {
    const newConfig = fillInferDefinitionFormAnnotation(
      this._config,
      this._annotations
    )

    return fillDefaultValueOfSelectionAttributes(newConfig, this._annotations)
  }
}
