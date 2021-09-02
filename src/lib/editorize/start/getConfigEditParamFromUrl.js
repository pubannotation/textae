import getQueryParams from './getQueryParams'

export default function (url) {
  if (url) {
    const queryParamMap = getQueryParams(url)

    if (queryParamMap.has('config_lock')) {
      return queryParamMap.get('config_lock')
    }
  }
  return null
}
