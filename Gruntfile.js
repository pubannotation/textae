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
        src: ['src/js/head.js', 'src/js/util.js', 'src/js/editor.js', 'src/js/control.js', 'src/js/tool.js', 'src/js/jquery.textae.js', 'src/js/main.js', 'src/js/tail.js'],
        dest: 'dist/js/lib-<%= pkg.name %>-<%= pkg.version %>.js',
      },
      css: {
        src: ['src/css/textae.css', 'src/css/textae-control.css'],
        dest: 'dist/css/lib-<%= pkg.name %>-<%= pkg.version %>.css',
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
      },
      dist: {
        files: {
          'dist/js/lib-<%= pkg.name %>-<%= pkg.version %>.min.js': ['<%= concat.js.dest %>']
        }
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'dist/css/',
        src: ['lib-<%= pkg.name %>-<%= pkg.version %>.css'],
        dest: 'dist/css/',
        rename: rename.ext(".min.css")
      }
    },
    copy: {
      main: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['css/**', '!css/textae*.css', 'demo/**', 'images/**', 'lib/**'],
          dest: 'dist/',
          filter: 'isFile'
        }, ]
      },
    },
    // for test
    jshint: {
      files: ['Gruntfile.js', 'src/js/*.js'],
      options: {
        jshintrc: '.jshintrc',
        ignores: ['src/js/head.js', 'src/js/tail.js']
      }
    },
    qunit: {
      all: 'test/src/util.html',
    },
    // for development
    watch: {
      javascript: {
        files: ['Gruntfile.js', 'src/js/*.js'],
        tasks: ['jshint']
      },
      static_files: {
        files: ['src/index.html', 'src/js/*.js', 'src/css/*.css'],
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
              }];
          },
        },
      }
    },
    open: {
      dev: {
        url: 'http://localhost:8000/src/?config=1_config.json&target=1_annotations.json'
      },
      demo: {
        url: 'http://localhost:8000/dist/demo/bionlp-st-ge/index.html'
      }
    },
  });

  grunt.registerTask('dist', ['jshint', 'qunit', 'clean', 'concat', 'uglify', 'copy', 'cssmin']);
  grunt.registerTask('dev', ['connect', 'open:dev', 'watch']);
  grunt.registerTask('demo', ['open:demo', 'connect:developmentServer:keepalive']);
};