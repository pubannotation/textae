import fetchAutocompleteCandidates from './fetchAutocompleteCandidates'

export default function fetchAutocompleteFromWs(term, done, autocompletionWs) {
  if (autocompletionWs) {
    fetchAutocompleteCandidates(autocompletionWs, term).then(done)
    return
  }

  done([])
}
