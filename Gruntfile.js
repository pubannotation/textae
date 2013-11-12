module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      dist: {
        src: ['src/dummy.js', 'src/util.js', 'src/buttonUtil.js', 'src/jquery.textae.js', 'src/textae.js'],
        dest: 'js/textae.js',
      }
    },
    watch: {
      javascript: {
        files: 'src/*.js',
        tasks: 'concat'
      },
      static_files: {
        files: ['textae.html', 'js/textae.js', 'css/*.css'],
        options: {
          livereload: true
        }
      }
    },
    connect: {
      uses_defaults: {}
    },
    qunit: {
      all: 'test/util.html'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-qunit');
};