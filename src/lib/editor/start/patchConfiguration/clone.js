export default function (config) {
  return config ? JSON.parse(JSON.stringify(config)) : {}
}
