export default function(config, newAttributeDefinitions) {
  for (const newDef of newAttributeDefinitions) {
    const index = config.findIndex((a) => a.pred === newDef.pred)
    if (index !== -1) {
      config[index] = Object.assign(newDef, config[index])
    } else {
      config.push(newDef)
    }
  }

  return config
}
