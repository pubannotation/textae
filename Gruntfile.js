'use strict';

var rename = {
  ext: function(ext) {
    return function(dest, src) {
      return dest + "/" + src.replace(/(\.[^\/\.]*)?$/, ext);
    };
  },
};

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // clean dist directory
    clean: {
      copy: "dist/*"
    },
    // create dist files
    concat: {
      js: {
        src: ['src/lib/head.js', 'src/lib/util.js', 'src/lib/editor-make-id-factory.js', 'src/lib/editor-make-model.js', 'src/lib/editor.js', 'src/lib/control.js', 'src/lib/tool.js', 'src/lib/jquery.textae.js', 'src/lib/main.js', 'src/lib/tail.js'],
        dest: 'dist/lib/lib-<%= pkg.name %>-<%= pkg.version %>.js',
      },
      css: {
        src: ['src/lib/css/textae.css', 'src/lib/css/textae-control.css', 'src/lib/css/textae-editor.css'],
        dest: 'dist/lib/css/lib-<%= pkg.name %>-<%= pkg.version %>.css',
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
      },
      dist: {
        files: {
          'dist/lib/lib-<%= pkg.name %>-<%= pkg.version %>.min.js': ['<%= concat.js.dest %>']
        }
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'dist/lib/css/',
        src: ['lib-<%= pkg.name %>-<%= pkg.version %>.css'],
        dest: 'dist/lib/css/',
        rename: rename.ext(".min.css")
      }
    },
    copy: {
      main: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['app/**', 'demo/**', 'images/**', 'vender/**'],
          dest: 'dist/',
          filter: 'isFile'
        }, ]
      },
    },
    // for test
    jshint: {
      files: ['Gruntfile.js', 'src/lib/*.js'],
      options: {
        jshintrc: '.jshintrc',
        ignores: ['src/lib/head.js', 'src/lib/tail.js']
      }
    },
    qunit: {
      all: 'test/src/util.html',
    },
    // for development
    watch: {
      javascript: {
        files: ['Gruntfile.js', 'src/lib/*.js'],
        tasks: ['jshint']
      },
      static_files: {
        files: ['src/development.html', 'src/lib/*.js', 'src/lib/css/*.css'],
        options: {
          livereload: true
        }
      },
    },
    connect: {
      developmentServer: {
        options: {
          middleware: function(connect, options) {
            return [connect.static(options.base),
              function(req, res) {
                if (req.method === "POST") {
                  // concat recieved data.
                  var fullBody = '';
                  req.on('data', function(chunk) {
                    fullBody += chunk.toString();
                  });

                  req.on('end', function() {
                    var decodedBody = require('querystring').parse(fullBody); // decode to object.
                    require("fs").writeFile(req.url.substr(1) + ".dev_data", decodedBody.annotations); // url as saved filename.
                    res.end();
                  });
                } else {
                  res.statusCode = 404;
                  res.end();
                }
              }
            ];
          },
        },
      }
    },
    open: {
      app: {
        url: 'http://localhost:8000/dist/app/textae.html?config=config.json&target=annotations.json'
      },
      dev: {
        url: 'http://localhost:8000/src/development.html?config=1_config.json&target=1_annotations.json'
      },
      demo: {
        url: 'http://localhost:8000/dist/demo/bionlp-st-ge/index.html'
      }
    },
  });

  grunt.registerTask('dev', ['connect', 'open:dev', 'watch']);
  grunt.registerTask('dist', ['jshint', 'qunit', 'clean', 'concat', 'uglify', 'copy', 'cssmin']);
  grunt.registerTask('demo', ['open:demo', 'connect:developmentServer:keepalive']);
  grunt.registerTask('app', ['open:app', 'connect:developmentServer:keepalive']);
};