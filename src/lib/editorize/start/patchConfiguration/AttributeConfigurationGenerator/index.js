import fillInferDefinitionFormAnnotation from './fillInferDefinitionFormAnnotation'
import fillDefaultValueOfSelectionAttributes from './fillDefaultValueOfSelectionAttributes'
import fillMandatoryValueOfNumericAttributes from './fillMandatoryValueOfNumericAttributes'
import fillDefaultValueOfStringAttributes from './fillDefaultValueOfStringAttributes'

export default class AttributeConfigurationGenerator {
  constructor(config = [], annotations = []) {
    this._annotations = annotations
    this._config = config
  }

  get configuration() {
    let newConfig = fillInferDefinitionFormAnnotation(
      this._config,
      this._annotations
    )

    newConfig = fillMandatoryValueOfNumericAttributes(newConfig)
    newConfig = fillDefaultValueOfStringAttributes(newConfig)

    return fillDefaultValueOfSelectionAttributes(newConfig, this._annotations)
  }
}
