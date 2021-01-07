export default function (autocompletionWs, localData, term, done) {
  if (!autocompletionWs) {
    done(localData)
    return
  }

  const request = new XMLHttpRequest()

  // Append a term parameter.
  const url = new URL(autocompletionWs, location)
  url.searchParams.append('term', term)

  request.open('GET', url.href, true)
  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      const data = JSON.parse(request.response)

      // Prior lacal data if duplicated
      const formattedData = data.filter(
        (t) => !localData.some((l) => t.id === l.id)
      )

      done(localData.concat(formattedData))
    }
  }

  request.send()
}
