// The browser cache is not available until the HTTP request is returned.
// To make only one request for a single URL, have an application-level cache.
export default class MediaDictionary {
  constructor() {
    this._cache = new Map()
  }

  async acquireContentTypeOf(url) {
    if (!url || this._cache.has(url)) {
      return Promise.resolve()
    }

    this._cache.set(url, false)

    // Use GET method.
    // Some domains do not have CORS settings in the OPTIONS method.
    // For example, lifesciencedb.jp.
    const request = new Request(url, {
      method: 'get',
      mode: 'cors',
      cache: 'force-cache'
    })

    try {
      const response = await fetch(request)
      this._cache.set(
        url,
        /image\/(jpg|png|gif)$/.test(response.headers.get('content-type'))
      )
    } catch (e) {
      console.warn(e.message, url)
    }
  }

  hasImageContentTypeOf(url) {
    return this._cache.get(url)
  }
}
