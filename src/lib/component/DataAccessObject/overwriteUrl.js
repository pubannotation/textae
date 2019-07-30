// Overwirte URL if the parameter has the save_to properties
export default function(url, parameter) {
  if (parameter.has('save_to')) {
    return parameter.get('save_to')
  }

  return url
}
