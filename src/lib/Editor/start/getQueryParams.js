export default function (url) {
  const queryParamMap = new Map()
  const queryStr = url.split('?')[1]

  if (queryStr) {
    const parameters = queryStr.split('&')

    for (let i = 0; i < parameters.length; i++) {
      const element = parameters[i].split('=')
      const paramName = decodeURIComponent(element[0])
      const paramValue = decodeURIComponent(element[1])
      queryParamMap.set(paramName, decodeURIComponent(paramValue))
    }
  }

  return queryParamMap
}
