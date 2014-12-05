'use strict';

var rename = {
  ext: function(ext) {
    return function(dest, src) {
      return dest + "/" + src.replace(/(\.[^\/\.]*)?$/, ext);
    };
  },
};

var browserifyFiles = {
  'src/lib/bundle.js': ['src/lib/jquery.textae.js']
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
          cwd: 'src/vender',
          src: ['images/*', 'jquery/dist/jquery.min.*', 'toastr/toastr.min.*', 'underscore/underscore-min.*', 'jquery-ui.min.*', 'jquery.jsPlumb-1.5.2-min.js'],
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
    // for test
    jshint: {
      files: ['Gruntfile.js', 'src/lib/**'],
      options: {
        jshintrc: '.jshintrc',
        ignores: ['src/lib/bundle.js', 'src/lib/css/**']
      }
    },
    jasmine_node: {
      all: ['test/']
    },
    // for development
    browserify: {
      dev: {
        files: browserifyFiles,
        options: {
          bundleOptions: {
            debug: true
          }
        }
      },
      dist: {
        files: browserifyFiles
      }
    },
    watch: {
      javascript: {
        files: ['Gruntfile.js', 'src/lib/**', '!src/lib/bundle.js'],
        tasks: ['jshint', 'browserify:dev']
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
                    require("fs").writeFile(req.url.substr(1) + ".dev_data", fullBody); // url as saved filename.
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
        url: 'http://localhost:8000/dist/textae.html?mode=edit&target=../src/1_annotations.json'
      },
      dev: {
        url: 'http://localhost:8000/src/development.html?config=1_config.json&target=1_annotations.json'
      },
      demo: {
        url: 'http://localhost:8000/dist/demo/bionlp-st-ge/demo-cdn.html'
      }
    },
  });

  grunt.registerTask('dev', ['browserify:dev', 'connect', 'open:dev', 'watch']);
  grunt.registerTask('dist', ['jshint', 'jasmine_node', 'clean', 'browserify:dist', 'concat', 'uglify', 'copy', 'replace:version', 'cssmin']);
  grunt.registerTask('demo', ['open:demo', 'connect:developmentServer:keepalive']);
  grunt.registerTask('app', ['open:app', 'connect:developmentServer:keepalive']);
};