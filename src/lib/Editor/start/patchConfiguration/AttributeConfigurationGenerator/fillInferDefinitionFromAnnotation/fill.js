// Complement the config with the generated Attribute definition.
// Does not override the existing Attribute definition.
export default function (config, newAttributeDefinitions) {
  for (const newDef of newAttributeDefinitions) {
    const index = config.findIndex((a) => a.pred === newDef.pred)
    if (index !== -1) {
      config[index] = { ...newDef, ...config[index] }
    } else {
      config.push(newDef)
    }
  }

  return config
}
