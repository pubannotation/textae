export default function(typeContainer, autocompletionWs, request, response) {
  const localData = getLocalData(typeContainer, request.term)

  if (!autocompletionWs) {
    response(localData)
    return
  }

  // Prior lacal data if duplicated
  $.getJSON(autocompletionWs, request, (data, status, xhr) => {
    const formattedData = data
      .filter(t => localData.filter(l => t.id === l.raw.id).length === 0)
      .map(raw => {
        return {
          label: `${raw.label}@${raw.id}`,
          raw
        }
      })

    response(localData.concat(formattedData))
  })
}

function getLocalData(typeContainer, term) {
  return typeContainer
    .getDefinedTypes()
    .filter(t => t.label)
    .filter(t => t.label.includes(term))
    .map(raw => {
      return {
        label: `${raw.label}@${raw.id}`,
        raw
      }
    })
}
