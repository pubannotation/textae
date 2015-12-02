'use strict'

var fs = require('fs'),
    http = require('http'),
    connectStatic = require('serve-static'),
    favicon = require('serve-favicon')

var rename = {
    ext: function(ext) {
        return function(dest, src) {
            return dest + "/" + src.replace(/(\.[^\/\.]*)?$/, ext)
        }
    },
}

var browserifyFiles = {
    'src/lib/bundle.js': ['src/lib/jquery.textae.js']
}

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt)
    var babelify = require('babelify')

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // clean dist directory
        clean: {
            dist: "dist/*",
            bundle: "src/lib/bundle.js"
        },
        // create dist files
        concat: {
            js: {
                src: [
                    'src/lib/bundle.js',
                    'src/lib/main.js',
                ],
                dest: 'dist/lib/<%= pkg.name %>-<%= pkg.version %>.js',
            },
            css: {
                src: [
                    'src/lib/css/textae.css',
                    'src/lib/css/textae-control.css',
                    'src/lib/css/textae-editor.css',
                    'src/lib/css/textae-editor-dialog.css',
                    'src/lib/css/textae-editor-type-pallet.css'
                ],
                dest: 'dist/lib/css/<%= pkg.name %>-<%= pkg.version %>.css',
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
            },
            dist: {
                files: {
                    'dist/lib/<%= pkg.name %>-<%= pkg.version %>.min.js': ['<%= concat.js.dest %>']
                }
            }
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: 'dist/lib/css/',
                src: ['<%= pkg.name %>-<%= pkg.version %>.css'],
                dest: 'dist/lib/css/',
                rename: rename.ext(".min.css")
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['demo/**', 'lib/css/images/**', '!**/*.psd'],
                    dest: 'dist/',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: 'dev/vender',
                    src: ['images/*', 'jquery-ui.min.*', 'jquery.jsPlumb-1.5.2-min.js'],
                    dest: 'dist/vender',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: 'node_modules',
                    src: ['jquery/dist/jquery.min.*', 'toastr/build/toastr.min.*', 'underscore/underscore-min.*'],
                    dest: 'dist/vender',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: 'src/app',
                    src: ['textae.*'],
                    dest: 'dist/',
                    filter: 'isFile'
                }]
            },
        },
        replace: {
            version: {
                src: ['dist/textae.html', 'dist/demo/bionlp-st-ge/*.html'],
                overwrite: true,
                replacements: [{
                    from: '{{version}}',
                    to: '<%= pkg.version %>'
                }]
            }
        },
        eslint: {
            target: 'src/lib/**/*.js'
        },
        jasmine_node: {
            all: ['test/']
        },
        browserify: {
            dist: {
                files: browserifyFiles
            }
        },
        less: {
            all: {
                files: {
                    'src/lib/css/textae.css': 'src/lib/css/textae.less',
                    'src/lib/css/textae-control.css': 'src/lib/css/textae-control.less',
                    'src/lib/css/textae-editor.css': 'src/lib/css/textae-editor.less',
                    'src/lib/css/textae-editor-dialog.css': 'src/lib/css/textae-editor-dialog.less',
                    'src/lib/css/textae-editor-type-pallet.css': 'src/lib/css/textae-editor-type-pallet.less'
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
                    middleware: function(connect, options) {
                        return [
                            favicon(__dirname + '/dev/favicon.ico'),
                            function(req, res, next) {
                                // Require authorization if file is 'private.json'.
                                var pathname = req._parsedUrl.pathname
                                if (pathname !== '/dev/private.json')
                                    return next()

                                var authorization = req.headers.authorization
                                if (!authorization) {
                                    return unauthorized(res)
                                }

                                var parts = authorization.split(' ')
                                if (parts.length !== 2)
                                    return next(error(400))

                                var scheme = parts[0],
                                    credentials = new Buffer(parts[1], 'base64').toString(),
                                    index = credentials.indexOf(':')
                                if ('Basic' !== scheme || index < 0)
                                    return next(error(400))

                                var user = credentials.slice(0, index),
                                    pass = credentials.slice(index + 1)

                                if (user !== 'Jin-Dong Kim' || pass !== 'passpass') {
                                    return unauthorized(res)
                                } else {
                                    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000')
                                    res.setHeader('Access-Control-Allow-Credentials', 'true')
                                    next()
                                }

                                function unauthorized(res) {
                                    res.statusCode = 401
                                    res.setHeader('WWW-Authenticate', 'Basic realm="textae development server."')
                                    res.end('Unauthorized')
                                }

                                function error(code, msg) {
                                    var err = new Error(msg || http.STATUS_CODES[code])
                                    err.status = code
                                    return err
                                }
                            },
                            connectStatic(options.base[0]),
                            function(req, res, next) {
                                // Stub to upload json.
                                if (req.method !== "POST")
                                    return next()

                                var filename = req.url.substr(1) + ".dev_data.json"
                                req.pipe(fs.createWriteStream(filename))
                                req.on('end', function() {
                                    res.end()
                                })
                            }
                        ]
                    },
                },
            }
        },
        open: {
            app: {
                url: 'http://localhost:8000/dist/textae.html?mode=edit&target=../dev/1_annotations.json'
            },
            dev: {
                url: 'http://localhost:8000/dev/development.html?config=1_config.json&target=1_annotations.json'
            },
            demo: {
                url: 'http://localhost:8000/dist/demo/bionlp-st-ge/demo-cdn.html'
            }
        },
    })

    grunt.registerTask('dev', ['connect', 'open:dev', 'watch'])
    grunt.registerTask('dist', ['eslint', 'jasmine_node', 'clean', 'browserify:dist', 'less', 'concat', 'uglify', 'copy', 'replace:version', 'cssmin'])
    grunt.registerTask('demo', ['open:demo', 'connect:developmentServer:keepalive'])
    grunt.registerTask('app', ['open:app', 'connect:developmentServer:keepalive'])
}
