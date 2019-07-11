import setTypeConfig from './setTypeConfig'

export default function(spanConfig, typeDefinition, config) {
  spanConfig.set(config)
  setTypeConfig(typeDefinition, config)
}
