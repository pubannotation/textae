import clone from './clone'

export default function(config, newAttributeDefinitions) {
  const patchedConfig = clone(config)

  if (!patchedConfig['attribute types']) {
    patchedConfig['attribute types'] = []
  }
  for (const newDef of newAttributeDefinitions) {
    const index = patchedConfig['attribute types'].findIndex(
      (a) => a.pred === newDef.pred
    )
    if (index !== -1) {
      patchedConfig['attribute types'][index] = Object.assign(
        newDef,
        patchedConfig['attribute types'][index]
      )
    } else {
      patchedConfig['attribute types'].push(newDef)
    }
  }

  return patchedConfig
}
