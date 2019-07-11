import setTypeConfig from './setTypeConfig'

export default function(spanConfig, typeContainer, config) {
  spanConfig.set(config)
  setTypeConfig(typeContainer, config)
}
