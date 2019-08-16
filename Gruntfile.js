'use strict'

const fs = require('fs')
const http = require('http')
const connectStatic = require('serve-static')
const favicon = require('serve-favicon')
const querystring = require('qs')

const rename = {
  ext(ext) {
    return function(dest, src) {
      return `${dest}/${src.replace(/(\.[^\/\.]*)?$/, ext)}`
    }
  }
}

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt)
  const saveLicense = require('uglify-save-license')

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // create dist files
    concat: {
      js: {
        src: [
          'node_modules/jquery/dist/jquery.min.js',
          'src/lib/modules/jquery.jsPlumb-1.5.5-min.js',
          'src/lib/bundle.js'
        ],
        dest: 'dist/lib/<%= pkg.name %>-<%= pkg.version %>.js'
      },
      css: {
        src: ['src/lib/css/textae.css'],
        dest: 'dist/lib/css/<%= pkg.name %>-<%= pkg.version %>.css'
      }
    },
    uglify: {
      options: {
        preserveComments: saveLicense,
        banner:
          '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/lib/<%= pkg.name %>-<%= pkg.version %>.min.js': [
            '<%= concat.js.dest %>'
          ]
        }
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'dist/lib/css/',
        src: ['<%= pkg.name %>-<%= pkg.version %>.css'],
        dest: 'dist/lib/css/',
        rename: rename.ext('.min.css')
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['demo/**', 'lib/css/images/**', 'lib/fonts/**', '!**/*.psd'],
            dest: 'dist/',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: 'src/app',
            src: ['editor.*'],
            dest: 'dist/',
            filter: 'isFile'
          }
        ]
      }
    },
    replace: {
      version: {
        src: ['dist/editor.html', 'dist/demo/**/*.html'],
        overwrite: true,
        replacements: [
          {
            from: '{{version}}',
            to: '<%= pkg.version %>'
          }
        ]
      }
    },
    less: {
      all: {
        files: {
          'src/lib/css/textae.css': 'src/lib/css/textae.less'
        }
      }
    },
    watch: {
      static_files: {
        files: [
          'dev/development.html',
          'dev/bundle.js',
          'src/lib/css/*.css',
          'src/*.json'
        ],
        options: {
          livereload: true
        }
      },
      less: {
        files: ['src/lib/css/*.less'],
        tasks: ['less']
      }
    },
    connect: {
      developmentServer: {
        options: {
          middleware(connect, options) {
            return [
              favicon(`${__dirname}/dev/favicon.ico`),
              function(req, res, next) {
                // Path to Sever Auth test
                const pathname = req._parsedUrl.pathname
                if (pathname !== '/dev/server_auth') return next()

                res.statusCode = 401
                res.setHeader('WWW-Authenticate', 'ServerPage')
                res.setHeader('Location', '/dev/dummy_auth_page.html')
                res.end('Unauthorized')
              },
              function(req, res, next) {
                // Require authorization if file is 'private.json'.
                const pathname = req._parsedUrl.pathname
                if (pathname !== '/dev/private.json') return next()

                const authorization = req.headers.authorization
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
                  res.setHeader(
                    'Access-Control-Allow-Origin',
                    'http://localhost:8000'
                  )
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
              },
              connectStatic(options.base[0]),
              function(req, res, next) {
                // Stub to upload json.
                if (req.method !== 'POST') return next()

                const filename = `${req.url.substr(1)}.dev_data.json`
                req.pipe(fs.createWriteStream(filename))
                req.on('end', () => {
                  res.end()
                })
              },
              function(req, res, next) {
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
                  const term = querystring.parse(req._parsedUrl.query).term

                  res.setHeader('Content-Type', 'application/json')
                  res.end(
                    JSON.stringify(
                      rawData.filter((d) => d.label.includes(term))
                    )
                  )
                } else {
                  return next()
                }
              }
            ]
          }
        }
      }
    },
    open: {
      app: {
        url:
          'http://localhost:8000/dist/editor.html?mode=edit&target=../dev/1_annotations.json'
      },
      dev: {
        url: 'http://localhost:8000/dev/development.html'
      },
      demo: {
        url: 'http://localhost:8000/dist/demo/development.html'
      }
    }
  })

  grunt.registerTask('dev', ['connect', 'open:dev', 'watch'])
  grunt.registerTask('dist', [
    'less',
    'concat',
    'uglify',
    'copy',
    'replace:version',
    'cssmin'
  ])
  grunt.registerTask('demo', [
    'open:demo',
    'connect:developmentServer:keepalive'
  ])
}
