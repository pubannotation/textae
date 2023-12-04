// The browser cache is not available until the HTTP request is returned.
// To make only one request for a single URL, have an application-level cache.
export default class MediaDictionary {
  constructor() {
    this._cache = new Map()
  }

  acquireContentTypeOf(url) {
    if (!url) {
      return Promise.resolve(false)
    }

    if (this._cache.has(url)) {
      return this._cache.get(url)
    }

    // Use GET method.
    // Some domains do not have CORS settings in the OPTIONS method.
    // For example, lifesciencedb.jp.
    const request = new Request(url, {
      method: 'get',
      mode: 'cors',
      cache: 'force-cache'
    })

    const promiseOfResult = new Promise((resolve) => {
      fetch(request)
        .then((response) => {
          const value = /image\/(jpg|png|gif)$/.test(
            response.headers.get('content-type')
          )

          // Set the result to the value property so that the result can be referenced from synchronous functions.
          // See: https://ourcodeworld.com/articles/read/317/how-to-check-if-a-javascript-promise-has-been-fulfilled-rejected-or-resolved
          promiseOfResult.value = value

          resolve(value)
        })
        .catch((e) => {
          console.warn(e.message, url)
          resolve(false)
        })
    })

    // Cache the promise of results, not the results themselves.
    // Caching the result causes an immediate redraw at the caller;
    // it does not wait for the HTTP response to arrive.
    this._cache.set(url, promiseOfResult)

    return promiseOfResult
  }

  hasImageContentTypeOf(url) {
    if (!url) {
      return false
    }

    return this._cache.get(url).value
  }
}
