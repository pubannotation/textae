module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      dist: {
        src: ['src/util.js', 'src/buttonUtil.js', 'src/head.js', 'src/editor.js', 'src/control.js', 'src/tool.js', 'src/jquery.textae.js', 'src/tail.js', 'src/main.js'],
        dest: 'dist/js/textae.js',
      }
    },
    watch: {
      javascript: {
        files: 'src/*.js',
        tasks: 'concat'
      },
      static_files: {
        files: ['textae.html', 'dist/js/textae.js', 'css/*.css'],
        options: {
          livereload: true
        }
      },
      jshint: {
        files: ['src/*.js'],
        tasks: 'jshint'
      }
    },
    connect: {
      uses_defaults: {}
    },
    qunit: {
      all: 'test/util.html'
    },
    jshint: {
      files: ['src/*.js'],
      options: {
        ignores: ['src/head.js', 'src/tail.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
};