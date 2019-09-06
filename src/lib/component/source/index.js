import $ from 'jquery'
import getLocalData from './getLocalData'

export default function(typeDefinition, autocompletionWs, request, response) {
  const localData = getLocalData(typeDefinition, request.term)

  if (!autocompletionWs) {
    response(localData)
    return
  }

  // Prior lacal data if duplicated
  $.getJSON(autocompletionWs, request, (data) => {
    const formattedData = data
      .filter((t) => localData.filter((l) => t.id === l.raw.id).length === 0)
      .map((raw) => {
        return {
          label: `${raw.label}@${raw.id}`,
          raw
        }
      })

    response(localData.concat(formattedData))
  })
}
