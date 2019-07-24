import setSpanAndTypeConfig from './setSpanAndTypeConfig'

export default function(spanConfig, typeDefinition, annotation) {
  spanConfig.reset()
  setSpanAndTypeConfig(spanConfig, typeDefinition, annotation.config)

  if (!annotation.config) {
    return 'no config'
  }

  return null
}
