import getLocalData from './getLocalData'

export default function(typeDefinition, autocompletionWs, term, response) {
  const localData = getLocalData(typeDefinition, term)

  if (!autocompletionWs) {
    response(localData)
    return
  }

  const request = new XMLHttpRequest()

  // Append a term parameter.
  const url = new URL(autocompletionWs, location)
  url.searchParams.append('term', term)

  request.open('GET', url.href, true)
  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      // Success!
      const data = JSON.parse(this.response)

      // Prior lacal data if duplicated
      const formattedData = data
        .filter((t) => localData.filter((l) => t.id === l.raw.id).length === 0)
        .map((raw) => {
          return {
            label: `${raw.label}@${raw.id}`,
            raw
          }
        })

      response(localData.concat(formattedData))
    }
  }

  request.send()
}
