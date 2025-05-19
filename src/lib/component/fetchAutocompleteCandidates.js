export default function fetchAutocompleteCandidates(autocompletionWs, term) {
  const url = new URL(autocompletionWs, location)
  url.searchParams.append('term', term)

  return fetch(url.href).then((response) => {
    if (response.ok) {
      return response.json()
    }
    return []
  })
}
