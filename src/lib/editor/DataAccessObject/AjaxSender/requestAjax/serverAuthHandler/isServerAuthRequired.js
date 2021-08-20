// When save failed, analyze the response code and headers.
// If the response follows the followings format, will open 'login-page-url' in a new popup window.
// ==============================================================
// 401 Unauthorized
// WWW-Authenticate: ServerPage
// Location: login-page-url
// ==============================================================
//
// ※ Server must returns "Access-Control-Expose-Headers". Because client scripts cannot read the headers
//  except for 'simple response header' when your requests are CORS.
// ==============================================================
// Access-Control-Expose-Headers: WWW-Authenticate,Location
// ==============================================================
export default function (httpResponse) {
  const statusCode = httpResponse.status
  const wwwAuthenticateHeader =
    httpResponse.getResponseHeader('WWW-Authenticate')
  const locationHeader = httpResponse.getResponseHeader('Location')
  const required =
    statusCode === 401 &&
    wwwAuthenticateHeader &&
    wwwAuthenticateHeader === 'ServerPage' &&
    locationHeader
  return required ? locationHeader : null
}
