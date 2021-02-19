'use strict'

const connect = require('connect')
const serveStatic = require('serve-static')
const path = require('path')
const http = require('http')
const favicon = require('serve-favicon')
const fs = require('fs')
const querystring = require('querystring')

const app = connect()

app
  .use(favicon(path.resolve(__dirname, 'favicon.ico')))
  .use((req, res, next) => {
    // Path to Sever Auth test
    const { pathname } = req._parsedUrl
    if (pathname !== '/dev/server_auth') return next()

    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'ServerPage')
    res.setHeader('Location', '/dev/dummy_auth_page.html')
    res.setHeader('Content-Type', 'text/plain')
    res.end('Unauthorized')
  })
  .use((req, res, next) => {
    // Require authorization if file is 'private.json'.
    const { pathname } = req._parsedUrl
    if (pathname !== '/dev/private.json') return next()

    const { authorization } = req.headers
    if (!authorization) {
      return unauthorized(res)
    }

    const parts = authorization.split(' ')
    if (parts.length !== 2) return next(error(400))

    const scheme = parts[0]
    const credentials = new Buffer(parts[1], 'base64').toString()
    const index = credentials.indexOf(':')
    if ('Basic' !== scheme || index < 0) return next(error(400))

    const user = credentials.slice(0, index)
    const pass = credentials.slice(index + 1)

    if (user !== 'Jin-Dong Kim' || pass !== 'passpass') {
      return unauthorized(res)
    } else {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000')
      res.setHeader('Access-Control-Allow-Credentials', 'true')
      next()
    }

    function unauthorized(res) {
      res.statusCode = 401
      res.setHeader(
        'WWW-Authenticate',
        'Basic realm="textae development server."'
      )
      res.end('Unauthorized')
    }

    function error(code, msg) {
      const err = new Error(msg || http.STATUS_CODES[code])
      err.status = code
      return err
    }
  })
  .use((req, res, next) => {
    // Stub to upload json.
    if (req.method !== 'POST') return next()

    const filename = `${req.url.substr(1)}.dev_data.json`
    req.pipe(fs.createWriteStream(filename))
    req.on('end', () => {
      res.end()
    })
  })
  .use((req, res, next) => {
    if (
      req.method === 'GET' &&
      req._parsedUrl.pathname === '/dev/autocomplete'
    ) {
      const rawData = [
        {
          id: 'http://dbpedia.org/ontology/parent',
          label: 'parent'
        },
        {
          id: 'http://dbpedia.org/ontology/productionCompany',
          label: 'productionCompany'
        },
        {
          label: 'Light stuff',
          id: 'http://www.yahoo.co.jp'
        },
        {
          label: 'Learning SPARQL',
          id:
            'http://www.amazon.com/Learning-SPARQL-Bob-DuCharme/dp/1449371434/ref=sr_1_1?ie=UTF8&qid=1452147643&sr=8-1&keywords=sparql'
        }
      ]
      const { term } = querystring.parse(req._parsedUrl.query)

      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(rawData.filter((d) => d.label.includes(term))))
    } else {
      return next()
    }
  })
  .use(serveStatic(path.resolve(__dirname, '../')))

http.createServer(app).listen(8000)
