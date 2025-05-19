export default function fetchAutocompleteFromWs(term, done, autocompletionWs) {
  if (autocompletionWs) {
    const url = new URL(autocompletionWs, location)
    url.searchParams.append('term', term)

    fetch(url.href)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then(done)
    return
  }

  done([])
}
